// Verification Layer - Proof of Delivery/Service Validation
// Purpose: Verify vendor fulfilled obligations before settlement
// Principle: Fraud prevention > convenience

import { prisma, ArtifactType, EventType } from '@contrack/database';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type ProofStatus = 'VERIFIED' | 'REJECTED' | 'PENDING_REVIEW' | 'MANUAL_REQUIRED';

export type ProofType =
    | 'DELIVERY_RECEIPT'
    | 'SERVICE_COMPLETION'
    | 'INVOICE'
    | 'SCREENSHOT'
    | 'DOCUMENT'
    | 'URL'
    | 'OTHER';

interface ProofEvidence {
    type: ProofType;
    url?: string;
    description?: string;
    metadata?: Record<string, any>;
}

interface VerificationInput {
    contractId: string;
    vendorId: string;
    proofEvidence: ProofEvidence[];
    invoiceAmount?: number;
}

interface VerificationResult {
    status: ProofStatus;
    confidence: number; // 0-100
    reasons: string[];
    requiresManualReview: boolean;
    success: boolean;
    error?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VERIFICATION LOGIC
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function analyzeProofQuality(evidence: ProofEvidence[]): {
    confidence: number;
    reasons: string[];
    requiresManual: boolean;
} {
    const reasons: string[] = [];
    let confidence = 50; // Base confidence

    // Rule 1: Multiple proof types increase confidence
    const uniqueTypes = new Set(evidence.map((e) => e.type));
    if (uniqueTypes.size >= 3) {
        confidence += 20;
        reasons.push('Multiple proof types provided');
    } else if (uniqueTypes.size === 1) {
        confidence -= 10;
        reasons.push('Only one proof type provided');
    }

    // Rule 2: Invoice is critical
    const hasInvoice = evidence.some((e) => e.type === 'INVOICE');
    if (hasInvoice) {
        confidence += 15;
        reasons.push('Invoice included');
    } else {
        confidence -= 15;
        reasons.push('No invoice provided - manual review recommended');
    }

    // Rule 3: Delivery receipt for goods
    const hasDeliveryReceipt = evidence.some((e) => e.type === 'DELIVERY_RECEIPT');
    if (hasDeliveryReceipt) {
        confidence += 10;
        reasons.push('Delivery receipt provided');
    }

    // Rule 4: Service completion evidence
    const hasServiceProof = evidence.some((e) => e.type === 'SERVICE_COMPLETION');
    if (hasServiceProof) {
        confidence += 10;
        reasons.push('Service completion documentation provided');
    }

    // Rule 5: Evidence with descriptions increases trust
    const evidenceWithDesc = evidence.filter((e) => e.description && e.description.length > 10);
    if (evidenceWithDesc.length >= 2) {
        confidence += 10;
        reasons.push('Detailed descriptions provided');
    }

    // Rule 6: URL-based evidence (lower trust)
    const urlEvidence = evidence.filter((e) => e.url);
    if (urlEvidence.length === evidence.length && evidence.length > 0) {
        confidence -= 10;
        reasons.push('All evidence is URL-based (requires validation)');
    }

    // Clamp confidence
    confidence = Math.max(0, Math.min(100, confidence));

    // Determine if manual review required
    const requiresManual = confidence < 60 || !hasInvoice || evidence.length === 0;

    return { confidence, reasons, requiresManual };
}

function determineStatus(confidence: number, requiresManual: boolean): ProofStatus {
    if (requiresManual) return 'MANUAL_REQUIRED';
    if (confidence >= 75) return 'VERIFIED';
    if (confidence >= 50) return 'PENDING_REVIEW';
    return 'REJECTED';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN VERIFICATION FUNCTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function verifyProof(input: VerificationInput): Promise<VerificationResult> {
    try {
        // Validate contract exists
        const contract = await prisma.contract.findUnique({
            where: { id: input.contractId },
        });

        if (!contract) {
            throw new Error('Contract not found');
        }

        if (contract.vendorId !== input.vendorId) {
            throw new Error('Vendor mismatch');
        }

        // Analyze proof quality
        const { confidence, reasons, requiresManual } = analyzeProofQuality(input.proofEvidence);
        const status = determineStatus(confidence, requiresManual);

        // Save verification artifact
        await prisma.artifact.create({
            data: {
                type: ArtifactType.VERIFICATION_PROOF,
                contractId: input.contractId,
                data: {
                    status,
                    confidence,
                    reasons,
                    evidenceCount: input.proofEvidence.length,
                    timestamp: new Date().toISOString(),
                },
            },
        });

        // Create event
        await prisma.event.create({
            data: {
                type: status === 'VERIFIED' ? EventType.USER_ACTION : EventType.SYSTEM_ERROR,
                contractId: input.contractId,
                userId: input.vendorId,
                metadata: {
                    action: 'PROOF_SUBMITTED',
                    status,
                    confidence,
                },
            },
        });

        // Update contract status if verified
        if (status === 'VERIFIED') {
            await prisma.contract.update({
                where: { id: input.contractId },
                data: { status: 'IN_VERIFICATION' },
            });
        }

        return {
            success: true,
            status,
            confidence,
            reasons,
            requiresManualReview: requiresManual,
        };
    } catch (error) {
        console.error('Verification failed:', error);

        // Fallback: MANUAL_REQUIRED
        await prisma.artifact.create({
            data: {
                type: ArtifactType.ERROR,
                contractId: input.contractId,
                data: {
                    error: 'Verification system failure',
                    fallback: 'MANUAL_REVIEW_REQUIRED',
                    timestamp: new Date().toISOString(),
                },
            },
        });

        return {
            success: false,
            status: 'MANUAL_REQUIRED',
            confidence: 0,
            reasons: ['Verification system unavailable'],
            requiresManualReview: true,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MANUAL REVIEW APPROVAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function approveManualReview(contractId: string, reviewerId: string, approved: boolean) {
    try {
        const status: ProofStatus = approved ? 'VERIFIED' : 'REJECTED';

        await prisma.artifact.create({
            data: {
                type: ArtifactType.VERIFICATION_PROOF,
                contractId,
                data: {
                    status,
                    reviewType: 'MANUAL',
                    reviewerId,
                    timestamp: new Date().toISOString(),
                },
            },
        });

        if (approved) {
            await prisma.contract.update({
                where: { id: contractId },
                data: { status: 'IN_VERIFICATION' },
            });
        }

        return { success: true, status };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

export * from '@contrack/database';
