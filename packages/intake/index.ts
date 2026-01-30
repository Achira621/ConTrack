// Intake Layer - Main Entry Point
// Purpose: Validate, normalize, and emit validated artifacts

import { z } from 'zod';
import { prisma, ArtifactType } from '@contrack/database';
import * as schemas from './schemas';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VALIDATION RESULT TYPE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type ValidationResult<T> =
    | { success: true; data: T; artifact: any }
    | { success: false; errors: z.ZodError; artifact: any };

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CORE VALIDATION FUNCTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function validateAndSaveArtifact<T>(
    schema: z.ZodSchema<T>,
    input: unknown,
    contractId?: string
): Promise<ValidationResult<T>> {
    try {
        const validatedData = schema.parse(input);

        // Save successful validation artifact
        const artifact = await prisma.artifact.create({
            data: {
                type: ArtifactType.INTAKE_VALIDATION,
                contractId,
                data: {
                    status: 'VALID',
                    input: validatedData,
                    timestamp: new Date().toISOString(),
                },
            },
        });

        return {
            success: true,
            data: validatedData,
            artifact,
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Save error artifact
            const artifact = await prisma.artifact.create({
                data: {
                    type: ArtifactType.ERROR,
                    contractId,
                    data: {
                        status: 'INVALID',
                        errors: error.errors,
                        timestamp: new Date().toISOString(),
                    },
                },
            });

            return {
                success: false,
                errors: error,
                artifact,
            };
        }

        // Unexpected error - rethrow
        throw error;
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORTED VALIDATION FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function validateCreateContract(input: unknown, clientId: string) {
    return validateAndSaveArtifact(schemas.CreateContractSchema, input);
}

export async function validateUpdateContract(input: unknown, contractId: string) {
    return validateAndSaveArtifact(schemas.UpdateContractSchema, input, contractId);
}

export async function validateCreatePool(input: unknown) {
    return validateAndSaveArtifact(schemas.CreatePoolSchema, input);
}

export async function validatePoolInvestment(input: unknown) {
    return validateAndSaveArtifact(schemas.PoolInvestmentSchema, input);
}

export async function validatePoolRedemption(input: unknown) {
    return validateAndSaveArtifact(schemas.PoolRedemptionSchema, input);
}

export async function validateCreateExposure(input: unknown, contractId: string) {
    return validateAndSaveArtifact(schemas.CreateExposureSchema, input, contractId);
}

export async function validateCreateUser(input: unknown) {
    return validateAndSaveArtifact(schemas.CreateUserSchema, input);
}

export async function validateUpdateUser(input: unknown) {
    return validateAndSaveArtifact(schemas.UpdateUserSchema, input);
}

// Re-export schemas for convenience
export * from './schemas';
