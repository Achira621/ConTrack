// Investor Pool Layer - Non-Lending Capital Pooling
// Purpose: Manage Units, NAV, and Exposure underwriting
// Compliance: Non-lending, non-guaranteed returns

import { prisma, Pool, PoolUnit, ContractExposure, ExposureStatus, EventType } from '@contrack/database';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PLATFORM_FEE_PERCENTAGE = 0.02; // 2% platform fee
const DEFAULT_ACTIVATION_FEE_PERCENTAGE = 0.01; // 1% activation fee

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// POOL INVESTMENT (Buy Units)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function investInPool(poolId: string, investorId: string, amount: number) {
    try {
        const pool = await prisma.pool.findUnique({ where: { id: poolId } });
        if (!pool) throw new Error('Pool not found');

        const currentNAV = pool.currentNAV;
        const unitsToIssue = amount / currentNAV;

        // Create PoolUnit record
        const poolUnit = await prisma.poolUnit.create({
            data: {
                poolId,
                investorId,
                units: unitsToIssue,
                purchaseNAV: currentNAV,
                purchaseAmount: amount,
            },
        });

        // Update Pool totals
        await prisma.pool.update({
            where: { id: poolId },
            data: {
                totalCapital: { increment: amount },
                availableCapital: { increment: amount },
                totalUnits: { increment: unitsToIssue },
            },
        });

        // Log NAV snapshot
        await prisma.poolNAV.create({
            data: {
                poolId,
                nav: currentNAV,
                totalCapital: pool.totalCapital + amount,
                totalUnits: pool.totalUnits + unitsToIssue,
            },
        });

        // Create event
        await prisma.event.create({
            data: {
                type: EventType.POOL_INVESTMENT,
                userId: investorId,
                metadata: {
                    poolId,
                    amount,
                    units: unitsToIssue,
                    nav: currentNAV,
                },
            },
        });

        return {
            success: true,
            poolUnit,
            unitsIssued: unitsToIssue,
            nav: currentNAV,
        };
    } catch (error) {
        console.error('Pool investment failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// POOL REDEMPTION (Sell Units)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function redeemFromPool(poolId: string, investorId: string, units: number) {
    try {
        const pool = await prisma.pool.findUnique({ where: { id: poolId } });
        if (!pool) throw new Error('Pool not found');

        // Check investor has enough units
        const investorUnits = await prisma.poolUnit.findMany({
            where: { poolId, investorId },
        });

        const totalUnits = investorUnits.reduce((sum, u) => sum + u.units, 0);
        if (totalUnits < units) throw new Error('Insufficient units');

        const currentNAV = pool.currentNAV;
        const redemptionAmount = units * currentNAV;

        // Check pool has available capital
        if (pool.availableCapital < redemptionAmount) {
            throw new Error('Insufficient liquidity in pool');
        }

        // Update Pool
        await prisma.pool.update({
            where: { id: poolId },
            data: {
                totalCapital: { decrement: redemptionAmount },
                availableCapital: { decrement: redemptionAmount },
                totalUnits: { decrement: units },
            },
        });

        // Create redemption event
        await prisma.event.create({
            data: {
                type: EventType.POOL_REDEMPTION,
                userId: investorId,
                metadata: {
                    poolId,
                    units,
                    amount: redemptionAmount,
                    nav: currentNAV,
                },
            },
        });

        return {
            success: true,
            redemptionAmount,
            unitsRedeemed: units,
            nav: currentNAV,
        };
    } catch (error) {
        console.error('Pool redemption failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CREATE EXPOSURE (Underwrite Contract)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function createExposure(
    poolId: string,
    contractId: string,
    exposureAmount: number,
    activationFee?: number
) {
    try {
        const pool = await prisma.pool.findUnique({ where: { id: poolId } });
        if (!pool) throw new Error('Pool not found');

        if (pool.availableCapital < exposureAmount) {
            throw new Error('Insufficient available capital in pool');
        }

        const fee = activationFee ?? exposureAmount * DEFAULT_ACTIVATION_FEE_PERCENTAGE;

        // Create Exposure
        const exposure = await prisma.contractExposure.create({
            data: {
                poolId,
                contractId,
                exposureAmount,
                activationFee: fee,
                status: ExposureStatus.ACTIVE,
            },
        });

        // Lock capital in pool
        await prisma.pool.update({
            where: { id: poolId },
            data: {
                lockedCapital: { increment: exposureAmount },
                availableCapital: { decrement: exposureAmount },
            },
        });

        // Create event
        await prisma.event.create({
            data: {
                type: EventType.EXPOSURE_CREATED,
                contractId,
                metadata: {
                    poolId,
                    exposureAmount,
                    activationFee: fee,
                },
            },
        });

        return {
            success: true,
            exposure,
        };
    } catch (error) {
        console.error('Exposure creation failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SETTLE EXPOSURE (Success Case)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function settleExposure(exposureId: string, delayPenalty: number = 0) {
    try {
        const exposure = await prisma.contractExposure.findUnique({
            where: { id: exposureId },
            include: { pool: true },
        });

        if (!exposure) throw new Error('Exposure not found');
        if (exposure.status !== ExposureStatus.ACTIVE) {
            throw new Error('Exposure is not active');
        }

        const totalReturn = exposure.exposureAmount + (exposure.activationFee || 0) + delayPenalty;
        const platformFee = totalReturn * PLATFORM_FEE_PERCENTAGE;
        const poolReturn = totalReturn - platformFee;

        // Update exposure
        await prisma.contractExposure.update({
            where: { id: exposureId },
            data: {
                status: ExposureStatus.SETTLED,
                delayPenalty,
                settledAt: new Date(),
            },
        });

        // Unlock and add returns to pool
        await prisma.pool.update({
            where: { id: exposure.poolId },
            data: {
                lockedCapital: { decrement: exposure.exposureAmount },
                availableCapital: { increment: poolReturn },
                totalCapital: { increment: poolReturn - exposure.exposureAmount },
            },
        });

        // Calculate new NAV
        const updatedPool = await prisma.pool.findUnique({
            where: { id: exposure.poolId },
        });

        if (updatedPool && updatedPool.totalUnits > 0) {
            const newNAV = updatedPool.totalCapital / updatedPool.totalUnits;

            await prisma.pool.update({
                where: { id: exposure.poolId },
                data: { currentNAV: newNAV },
            });

            // Log NAV update
            await prisma.poolNAV.create({
                data: {
                    poolId: exposure.poolId,
                    nav: newNAV,
                    totalCapital: updatedPool.totalCapital,
                    totalUnits: updatedPool.totalUnits,
                },
            });

            await prisma.event.create({
                data: {
                    type: EventType.NAV_UPDATED,
                    metadata: {
                        poolId: exposure.poolId,
                        oldNAV: exposure.pool.currentNAV,
                        newNAV,
                    },
                },
            });
        }

        await prisma.event.create({
            data: {
                type: EventType.EXPOSURE_SETTLED,
                contractId: exposure.contractId,
                metadata: {
                    exposureId,
                    poolReturn,
                    platformFee,
                    delayPenalty,
                },
            },
        });

        return {
            success: true,
            poolReturn,
            platformFee,
        };
    } catch (error) {
        console.error('Exposure settlement failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DEFAULT EXPOSURE (Failure Case)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function defaultExposure(exposureId: string, recoveryAmount: number = 0) {
    try {
        const exposure = await prisma.contractExposure.findUnique({
            where: { id: exposureId },
            include: { pool: true },
        });

        if (!exposure) throw new Error('Exposure not found');

        const loss = exposure.exposureAmount - recoveryAmount;

        // Update exposure
        await prisma.contractExposure.update({
            where: { id: exposureId },
            data: {
                status: ExposureStatus.DEFAULTED,
                recoveryAmount,
                settledAt: new Date(),
            },
        });

        // Write down capital
        await prisma.pool.update({
            where: { id: exposure.poolId },
            data: {
                lockedCapital: { decrement: exposure.exposureAmount },
                availableCapital: { increment: recoveryAmount },
                totalCapital: { decrement: loss },
            },
        });

        // Recalculate NAV (DOWN)
        const updatedPool = await prisma.pool.findUnique({
            where: { id: exposure.poolId },
        });

        if (updatedPool && updatedPool.totalUnits > 0) {
            const newNAV = updatedPool.totalCapital / updatedPool.totalUnits;

            await prisma.pool.update({
                where: { id: exposure.poolId },
                data: { currentNAV: newNAV },
            });

            await prisma.poolNAV.create({
                data: {
                    poolId: exposure.poolId,
                    nav: newNAV,
                    totalCapital: updatedPool.totalCapital,
                    totalUnits: updatedPool.totalUnits,
                },
            });
        }

        await prisma.event.create({
            data: {
                type: EventType.EXPOSURE_DEFAULTED,
                contractId: exposure.contractId,
                metadata: {
                    exposureId,
                    loss,
                    recoveryAmount,
                },
            },
        });

        return {
            success: true,
            loss,
            recoveryAmount,
        };
    } catch (error) {
        console.error('Exposure default handling failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// Export all functions
export * from '@contrack/database';
