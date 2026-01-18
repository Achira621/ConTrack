// Settlement Layer - Contract State Transitions & Payouts
// Purpose: Finalize contracts, calculate payouts, integrate with Investor Pool

import { prisma, ContractStatus, ArtifactType, EventType } from '@contrack/database';
import { settleExposure } from '@contrack/investor-pool';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SETTLEMENT CALCULATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PLATFORM_FEE_PERCENTAGE = 0.025; // 2.5% platform fee

interface SettlementBreakdown {
    totalAmount: number;
    platformFee: number;
    vendorPayout: number;
    poolReturns?: number;
}

function calculateSettlement(contractValue: number, hasPoolExposure: boolean): SettlementBreakdown {
    const platformFee = contractValue * PLATFORM_FEE_PERCENTAGE;
    const vendorPayout = contractValue - platformFee;

    return {
        totalAmount: contractValue,
        platformFee,
        vendorPayout,
    };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SETTLE CONTRACT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function settleContract(contractId: string, actualAmount?: number) {
    try {
        const contract = await prisma.contract.findUnique({
            where: { id: contractId },
            include: { exposures: true },
        });

        if (!contract) throw new Error('Contract not found');
        if (contract.status === ContractStatus.SETTLED) {
            throw new Error('Contract already settled');
        }

        const settlementAmount = actualAmount ?? contract.value;
        const activeExposures = contract.exposures.filter((e) => e.status === 'ACTIVE');

        // Calculate settlement breakdown
        const breakdown = calculateSettlement(settlementAmount, activeExposures.length > 0);

        // Settle pool exposures first
        for (const exposure of activeExposures) {
            await settleExposure(exposure.id);
        }

        // Update contract
        await prisma.contract.update({
            where: { id: contractId },
            data: {
                status: ContractStatus.SETTLED,
                settlementAmount,
                settledAt: new Date(),
            },
        });

        // Save settlement artifact
        await prisma.artifact.create({
            data: {
                type: ArtifactType.SETTLEMENT_OUTCOME,
                contractId,
                data: {
                    breakdown,
                    timestamp: new Date().toISOString(),
                    exposuresSettled: activeExposures.length,
                },
            },
        });

        // Create event
        await prisma.event.create({
            data: {
                type: EventType.CONTRACT_SETTLED,
                contractId,
                metadata: breakdown,
            },
        });

        return {
            success: true,
            breakdown,
        };
    } catch (error) {
        console.error('Settlement failed:', error);

        // Save error artifact
        await prisma.artifact.create({
            data: {
                type: ArtifactType.ERROR,
                contractId,
                data: {
                    error: error instanceof Error ? error.message : 'Unknown error',
                    timestamp: new Date().toISOString(),
                },
            },
        });

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CANCEL CONTRACT (Failure Path)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function cancelContract(contractId: string, reason: string) {
    try {
        const contract = await prisma.contract.findUnique({
            where: { id: contractId },
            include: { exposures: true },
        });

        if (!contract) throw new Error('Contract not found');

        // Handle active exposures
        const activeExposures = contract.exposures.filter((e) => e.status === 'ACTIVE');

        for (const exposure of activeExposures) {
            // Mark as defaulted with 0 recovery
            await prisma.contractExposure.update({
                where: { id: exposure.id },
                data: {
                    status: 'DEFAULTED',
                    recoveryAmount: 0,
                    settledAt: new Date(),
                },
            });
        }

        // Update contract
        await prisma.contract.update({
            where: { id: contractId },
            data: {
                status: ContractStatus.CANCELLED,
            },
        });

        await prisma.artifact.create({
            data: {
                type: ArtifactType.SETTLEMENT_OUTCOME,
                contractId,
                data: {
                    status: 'CANCELLED',
                    reason,
                    timestamp: new Date().toISOString(),
                },
            },
        });

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

export * from '@contrack/database';
