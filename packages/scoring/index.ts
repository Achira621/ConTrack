// Scoring Layer - ConScore Risk Assessment
// Purpose: Determine default likelihood using AI-inspired evaluation
// Compliance: No hard credit scores, no discriminatory attributes

import { prisma, Contract, ArtifactType, EventType } from '@contrack/database';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const DEFAULT_SCORE = 60;
const DEFAULT_RISK_TIER = 'NEUTRAL';

export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH' | 'NEUTRAL';

interface ScoringInput {
    contractId: string;
    contractValue: number;
    clientId: string;
    vendorId?: string;
    historicalData?: {
        clientPastContracts?: number;
        clientDefaults?: number;
        vendorPastContracts?: number;
    };
}

interface ScoringResult {
    score: number; // 0-100
    riskTier: RiskTier;
    pricingModifier: number;
    rationale: string[];
    success: boolean;
    error?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCORING LOGIC (Conceptual AI Evaluation)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function calculateScore(input: ScoringInput): { score: number; rationale: string[] } {
    let score = 50; // Base score
    const rationale: string[] = [];

    // Factor 1: Contract Value (Higher value = slightly higher risk)
    if (input.contractValue < 5000) {
        score += 10;
        rationale.push('Small contract value reduces risk');
    } else if (input.contractValue > 50000) {
        score -= 10;
        rationale.push('Large contract value increases scrutiny');
    }

    // Factor 2: Client History
    const clientContracts = input.historicalData?.clientPastContracts || 0;
    const clientDefaults = input.historicalData?.clientDefaults || 0;

    if (clientContracts > 5) {
        score += 15;
        rationale.push('Client has established history');
    }

    if (clientDefaults > 0) {
        score -= 20 * clientDefaults;
        rationale.push(`Client has ${clientDefaults} past default(s)`);
    }

    // Factor 3: Vendor Reputation
    const vendorContracts = input.historicalData?.vendorPastContracts || 0;
    if (vendorContracts > 10) {
        score += 10;
        rationale.push('Vendor has strong track record');
    }

    // Factor 4: Random Market Conditions (Simulated)
    const marketFactor = Math.random() > 0.5 ? 5 : -5;
    score += marketFactor;
    rationale.push(`Market conditions: ${marketFactor > 0 ? 'favorable' : 'uncertain'}`);

    // Clamp score between 0-100
    score = Math.max(0, Math.min(100, score));

    return { score, rationale };
}

function determineRiskTier(score: number): RiskTier {
    if (score >= 75) return 'LOW';
    if (score >= 50) return 'MEDIUM';
    if (score >= 30) return 'HIGH';
    return 'NEUTRAL';
}

function calculatePricingModifier(riskTier: RiskTier): number {
    switch (riskTier) {
        case 'LOW':
            return 0.01; // 1% premium
        case 'MEDIUM':
            return 0.015; // 1.5% premium
        case 'HIGH':
            return 0.03; // 3% premium
        case 'NEUTRAL':
        default:
            return 0.02; // 2% premium
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN SCORING FUNCTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function scoreContract(input: ScoringInput): Promise<ScoringResult> {
    try {
        // Get historical data if not provided
        if (!input.historicalData) {
            const clientContracts = await prisma.contract.count({
                where: { clientId: input.clientId, status: 'SETTLED' },
            });

            const clientDefaults = await prisma.contract.count({
                where: { clientId: input.clientId, status: 'CANCELLED' },
            });

            const vendorContracts = input.vendorId
                ? await prisma.contract.count({
                    where: { vendorId: input.vendorId, status: 'SETTLED' },
                })
                : 0;

            input.historicalData = {
                clientPastContracts: clientContracts,
                clientDefaults,
                vendorPastContracts: vendorContracts,
            };
        }

        // Calculate score
        const { score, rationale } = calculateScore(input);
        const riskTier = determineRiskTier(score);
        const pricingModifier = calculatePricingModifier(riskTier);

        // Save scoring artifact
        await prisma.artifact.create({
            data: {
                type: ArtifactType.SCORING_RESULT,
                contractId: input.contractId,
                data: {
                    score,
                    riskTier,
                    pricingModifier,
                    rationale,
                    timestamp: new Date().toISOString(),
                },
            },
        });

        // Create event
        await prisma.event.create({
            data: {
                type: EventType.USER_ACTION,
                contractId: input.contractId,
                metadata: {
                    action: 'SCORED',
                    score,
                    riskTier,
                },
            },
        });

        return {
            success: true,
            score,
            riskTier,
            pricingModifier,
            rationale,
        };
    } catch (error) {
        console.error('Scoring failed:', error);

        // Fallback: DEFAULT_SCORE
        await prisma.artifact.create({
            data: {
                type: ArtifactType.WARNING,
                contractId: input.contractId,
                data: {
                    message: 'Scoring failed, using default score',
                    defaultScore: DEFAULT_SCORE,
                    timestamp: new Date().toISOString(),
                },
            },
        });

        return {
            success: false,
            score: DEFAULT_SCORE,
            riskTier: DEFAULT_RISK_TIER as RiskTier,
            pricingModifier: 0.02,
            rationale: ['Scoring unavailable, using default'],
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

export * from '@contrack/database';
