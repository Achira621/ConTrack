// Reporting Layer - Analytics & Metrics Generation
// Purpose: Transform events/contracts into dashboards and summaries
// Principle: Partial reports allowed, tolerates missing data

import { prisma } from '@contrack/database';
import type { Contract, ContractExposure, PoolUnit, Pool, UserRole, ContractStatus, ExposureStatus } from '@contrack/database';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VENDOR METRICS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface VendorMetrics {
    totalContracts: number;
    activeContracts: number;
    completedContracts: number;
    totalEarnings: number;
    pendingPayouts: number;
    averageContractValue: number;
    proofVerificationRate: number;
}

export async function getVendorMetrics(vendorId: string): Promise<VendorMetrics> {
    try {
        const contracts = await prisma.contract.findMany({
            where: { vendorId },
        });

        const totalContracts = contracts.length;
        const activeContracts = contracts.filter((c: Contract) => c.status === ContractStatus.ACTIVE).length;
        const completedContracts = contracts.filter((c: Contract) => c.status === ContractStatus.SETTLED).length;

        const totalEarnings = contracts
            .filter((c: Contract) => c.status === ContractStatus.SETTLED)
            .reduce((sum: number, c: Contract) => sum + (c.settlementAmount || 0), 0);

        const pendingPayouts = contracts
            .filter((c: Contract) => c.status === ContractStatus.ACTIVE || c.status === ContractStatus.IN_VERIFICATION)
            .reduce((sum: number, c: Contract) => sum + c.value, 0);

        const averageContractValue =
            totalContracts > 0 ? contracts.reduce((sum: number, c: Contract) => sum + c.value, 0) / totalContracts : 0;

        // Simplified verification rate (would need artifact checks in real impl)
        const verifiedContracts = contracts.filter((c: Contract) => c.status !== ContractStatus.DRAFT).length;
        const proofVerificationRate = totalContracts > 0 ? verifiedContracts / totalContracts : 0;

        return {
            totalContracts,
            activeContracts,
            completedContracts,
            totalEarnings,
            pendingPayouts,
            averageContractValue,
            proofVerificationRate,
        };
    } catch (error) {
        console.error('Vendor metrics failed:', error);
        return {
            totalContracts: 0,
            activeContracts: 0,
            completedContracts: 0,
            totalEarnings: 0,
            pendingPayouts: 0,
            averageContractValue: 0,
            proofVerificationRate: 0,
        };
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLIENT METRICS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface ClientMetrics {
    totalContracts: number;
    activeObligations: number;
    settledContracts: number;
    totalSpent: number;
    pendingPayments: number;
    averageSettlementTime: number; // in days
}

export async function getClientMetrics(clientId: string): Promise<ClientMetrics> {
    try {
        const contracts = await prisma.contract.findMany({
            where: { clientId },
        });

        const totalContracts = contracts.length;
        const activeObligations = contracts.filter(
            (c: Contract) => c.status === ContractStatus.ACTIVE || c.status === ContractStatus.IN_VERIFICATION
        ).length;
        const settledContracts = contracts.filter((c: Contract) => c.status === ContractStatus.SETTLED).length;

        const totalSpent = contracts
            .filter((c: Contract) => c.status === ContractStatus.SETTLED)
            .reduce((sum: number, c: Contract) => sum + (c.settlementAmount || c.value), 0);

        const pendingPayments = contracts
            .filter((c: Contract) => c.status === ContractStatus.ACTIVE || c.status === ContractStatus.IN_VERIFICATION)
            .reduce((sum: number, c: Contract) => sum + c.value, 0);

        // Simplified settlement time calculation
        const settledWithDates = contracts.filter((c: Contract) => c.status === ContractStatus.SETTLED && c.settledAt);
        const averageSettlementTime =
            settledWithDates.length > 0
                ? settledWithDates.reduce((sum: number, c: Contract) => {
                    const days = Math.floor(
                        (new Date(c.settledAt!).getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return sum + days;
                }, 0) / settledWithDates.length
                : 0;

        return {
            totalContracts,
            activeObligations,
            settledContracts,
            totalSpent,
            pendingPayments,
            averageSettlementTime,
        };
    } catch (error) {
        console.error('Client metrics failed:', error);
        return {
            totalContracts: 0,
            activeObligations: 0,
            settledContracts: 0,
            totalSpent: 0,
            pendingPayments: 0,
            averageSettlementTime: 0,
        };
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INVESTOR/POOL METRICS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface PoolMetrics {
    totalCapital: number;
    lockedCapital: number;
    availableCapital: number;
    currentNAV: number;
    totalUnits: number;
    activeExposures: number;
    settledExposures: number;
    defaultedExposures: number;
    totalReturn: number;
    returnPercentage: number;
}

export async function getPoolMetrics(poolId: string): Promise<PoolMetrics> {
    try {
        const pool = await prisma.pool.findUnique({
            where: { id: poolId },
            include: { exposures: true },
        });

        if (!pool) {
            throw new Error('Pool not found');
        }

        const activeExposures = pool.exposures.filter((e: ContractExposure) => e.status === ExposureStatus.ACTIVE).length;
        const settledExposures = pool.exposures.filter((e: ContractExposure) => e.status === ExposureStatus.SETTLED).length;
        const defaultedExposures = pool.exposures.filter((e: ContractExposure) => e.status === ExposureStatus.DEFAULTED).length;

        const totalReturn = pool.totalCapital - pool.totalCapital / pool.currentNAV;
        const returnPercentage = pool.totalCapital > 0 ? (totalReturn / pool.totalCapital) * 100 : 0;

        return {
            totalCapital: pool.totalCapital,
            lockedCapital: pool.lockedCapital,
            availableCapital: pool.availableCapital,
            currentNAV: pool.currentNAV,
            totalUnits: pool.totalUnits,
            activeExposures,
            settledExposures,
            defaultedExposures,
            totalReturn,
            returnPercentage,
        };
    } catch (error) {
        console.error('Pool metrics failed:', error);
        return {
            totalCapital: 0,
            lockedCapital: 0,
            availableCapital: 0,
            currentNAV: 1.0,
            totalUnits: 0,
            activeExposures: 0,
            settledExposures: 0,
            defaultedExposures: 0,
            totalReturn: 0,
            returnPercentage: 0,
        };
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INVESTOR PERSONAL METRICS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface InvestorMetrics {
    totalInvestment: number;
    totalUnits: number;
    currentValue: number;
    unrealizedGains: number;
    poolsInvested: number;
}

type PoolUnitWithPool = PoolUnit & { pool: Pool };

export async function getInvestorMetrics(investorId: string): Promise<InvestorMetrics> {
    try {
        const units = await prisma.poolUnit.findMany({
            where: { investorId },
            include: { pool: true },
        });

        const totalInvestment = units.reduce((sum: number, u: PoolUnitWithPool) => sum + u.purchaseAmount, 0);
        const totalUnits = units.reduce((sum: number, u: PoolUnitWithPool) => sum + u.units, 0);
        const currentValue = units.reduce((sum: number, u: PoolUnitWithPool) => sum + u.units * u.pool.currentNAV, 0);
        const unrealizedGains = currentValue - totalInvestment;
        const poolsInvested = new Set(units.map((u: PoolUnitWithPool) => u.poolId)).size;

        return {
            totalInvestment,
            totalUnits,
            currentValue,
            unrealizedGains,
            poolsInvested,
        };
    } catch (error) {
        console.error('Investor metrics failed:', error);
        return {
            totalInvestment: 0,
            totalUnits: 0,
            currentValue: 0,
            unrealizedGains: 0,
            poolsInvested: 0,
        };
    }
}

export * from '@contrack/database';
