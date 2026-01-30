// Recovery Module (F6)
// Purpose: Handle client delayed/defaulted payments post-pool payout
// Principle: Recovery goes to Pool, not Vendor

import { prisma, ContractExposure, ExposureStatus, EventType } from '@contrack/database';
import { defaultExposure } from '@contrack/investor-pool';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RECOVERY TRACKING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface RecoveryEvent {
    exposureId: string;
    recoveryAmount: number;
    recoveryType: 'PARTIAL' | 'FULL';
    recoveryDate: Date;
    notes?: string;
}

export async function recordRecovery(event: RecoveryEvent) {
    try {
        const exposure = await prisma.contractExposure.findUnique({
            where: { id: event.exposureId },
            include: { contract: true, pool: true },
        });

        if (!exposure) {
            return { success: false, error: 'Exposure not found' };
        }

        if (exposure.status !== ExposureStatus.DEFAULTED) {
            return { success: false, error: 'Exposure is not in defaulted status' };
        }

        const previousRecovery = exposure.recoveryAmount || 0;
        const totalRecovery = previousRecovery + event.recoveryAmount;

        // Update exposure with recovery
        await prisma.contractExposure.update({
            where: { id: event.exposureId },
            data: {
                recoveryAmount: totalRecovery,
                status: event.recoveryType === 'FULL' ? ExposureStatus.RECOVERED : ExposureStatus.DEFAULTED,
            },
        });

        // Update pool capital (recovery goes to pool)
        await prisma.pool.update({
            where: { id: exposure.poolId },
            data: {
                totalCapital: { increment: event.recoveryAmount },
                availableCapital: { increment: event.recoveryAmount },
            },
        });

        // Recalculate NAV
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

        // Create recovery event
        await prisma.event.create({
            data: {
                type: EventType.USER_ACTION,
                contractId: exposure.contractId,
                metadata: {
                    action: 'RECOVERY_RECORDED',
                    exposureId: event.exposureId,
                    recoveryAmount: event.recoveryAmount,
                    recoveryType: event.recoveryType,
                    totalRecovered: totalRecovery,
                },
            },
        });

        return {
            success: true,
            totalRecovered: totalRecovery,
            exposureStatus: event.recoveryType === 'FULL' ? 'RECOVERED' : 'PARTIAL_RECOVERY',
        };
    } catch (error) {
        console.error('Recovery recording failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GET RECOVERY STATUS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function getRecoveryStatus(contractId: string) {
    try {
        const exposures = await prisma.contractExposure.findMany({
            where: { contractId },
            include: { pool: true },
        });

        const recoveryData = exposures.map((exp) => ({
            exposureId: exp.id,
            poolName: exp.pool.name,
            originalAmount: exp.exposureAmount,
            recoveredAmount: exp.recoveryAmount || 0,
            status: exp.status,
            recoveryPercentage:
                exp.exposureAmount > 0 ? ((exp.recoveryAmount || 0) / exp.exposureAmount) * 100 : 0,
        }));

        return {
            success: true,
            recoveryData,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

export * from '@contrack/database';
