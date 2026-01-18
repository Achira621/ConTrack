// Intake Layer - Schema Validation
// Purpose: Validate and normalize all incoming data before processing

import { z } from 'zod';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONTRACT INTAKE SCHEMAS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const CreateContractSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200),
    description: z.string().max(2000).optional(),
    value: z.number().positive('Contract value must be positive'),
    clientId: z.string().cuid('Invalid client ID format'),
    vendorId: z.string().cuid('Invalid vendor ID format').optional(),
});

export const UpdateContractSchema = z.object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().max(2000).optional(),
    value: z.number().positive().optional(),
    vendorId: z.string().cuid().optional(),
    status: z.enum(['DRAFT', 'ACTIVE', 'IN_VERIFICATION', 'SETTLED', 'DISPUTED', 'CANCELLED']).optional(),
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INVESTOR POOL INTAKE SCHEMAS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const CreatePoolSchema = z.object({
    name: z.string().min(3).max(100),
    description: z.string().max(500).optional(),
    riskCategory: z.enum(['LOW_RISK', 'MEDIUM_RISK', 'HIGH_RISK', 'SECTORAL']),
});

export const PoolInvestmentSchema = z.object({
    poolId: z.string().cuid('Invalid pool ID'),
    investorId: z.string().cuid('Invalid investor ID'),
    amount: z.number().positive('Investment amount must be positive').min(100, 'Minimum investment is 100'),
});

export const PoolRedemptionSchema = z.object({
    poolId: z.string().cuid(),
    investorId: z.string().cuid(),
    units: z.number().positive('Units to redeem must be positive'),
});

export const CreateExposureSchema = z.object({
    poolId: z.string().cuid(),
    contractId: z.string().cuid(),
    exposureAmount: z.number().positive('Exposure amount must be positive'),
    activationFee: z.number().min(0).optional(),
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// USER INTAKE SCHEMAS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const CreateUserSchema = z.object({
    email: z.string().email('Invalid email format'),
    name: z.string().min(2).max(100).optional(),
    role: z.enum(['CLIENT', 'VENDOR', 'INVESTOR', 'ADMIN']),
});

export const UpdateUserSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    role: z.enum(['CLIENT', 'VENDOR', 'INVESTOR', 'ADMIN']).optional(),
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPE EXPORTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type CreateContractInput = z.infer<typeof CreateContractSchema>;
export type UpdateContractInput = z.infer<typeof UpdateContractSchema>;
export type CreatePoolInput = z.infer<typeof CreatePoolSchema>;
export type PoolInvestmentInput = z.infer<typeof PoolInvestmentSchema>;
export type PoolRedemptionInput = z.infer<typeof PoolRedemptionSchema>;
export type CreateExposureInput = z.infer<typeof CreateExposureSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
