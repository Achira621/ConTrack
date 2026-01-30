// Contract Creation Module (F1)
// Purpose: Convert Vendor invoice/PO into digital settlement contract
// Principle: Client must explicitly activate, no self-activation

import { prisma, ContractStatus, ArtifactType, EventType } from '@contrack/database';
import { validateCreateContract, CreateContractInput } from '@contrack/intake';
import { scoreContract } from '@contrack/scoring';
import { createPaymentSchedule } from '@contrack/payment';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAYMENT TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface PaymentMilestone {
    name: string;
    description?: string;
    percentage: number; // 0-100
    dueDate?: Date;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONTRACT CREATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface CreateContractRequest {
    // Vendor details
    vendorId: string;
    vendorName?: string;

    // Client details
    clientId: string;
    clientName?: string;

    // Invoice/PO metadata
    invoiceNumber?: string;
    poNumber?: string;
    amount: number;
    currency?: string;

    // Contract details
    title: string;
    description?: string;
    settlementTerms: string; // e.g., "Net-30"
    dueDate?: Date;
    workType: 'GOODS' | 'SERVICES' | 'MIXED';

    // Supporting docs (optional)
    supportingDocs?: {
        type: string;
        url: string;
        name: string;
    }[];

    // Payment schedule (optional)
    paymentSchedule?: PaymentMilestone[];
}

export interface CreateContractResult {
    success: boolean;
    contractId?: string;
    status: 'CREATED' | 'REQUIRES_COMPLETION' | 'FAILED';
    score?: number;
    riskTier?: string;
    error?: string;
    warnings?: string[];
}

export async function createContract(request: CreateContractRequest): Promise<CreateContractResult> {
    const warnings: string[] = [];

    try {
        // Step 1: Validate required fields
        if (!request.title || request.title.length < 3) {
            return {
                success: false,
                status: 'REQUIRES_COMPLETION',
                error: 'Title is required (minimum 3 characters)',
            };
        }

        if (!request.settlementTerms) {
            warnings.push('Settlement terms not specified, defaulting to Net-30');
            request.settlementTerms = 'Net-30';
        }

        // Step 2: Validate through Intake Layer
        const validationInput: CreateContractInput = {
            title: request.title,
            description: request.description,
            value: request.amount,
            clientId: request.clientId,
            vendorId: request.vendorId,
        };

        const validation = await validateCreateContract(validationInput, request.clientId);

        if (!validation.success) {
            return {
                success: false,
                status: 'FAILED',
                error: 'Validation failed',
            };
        }

        // Step 3: Create Contract in Database
        const contract = await prisma.contract.create({
            data: {
                title: request.title,
                description: request.description || `Contract for ${request.workType}: ${request.title}`,
                value: request.amount,
                clientId: request.clientId,
                vendorId: request.vendorId,
                status: ContractStatus.DRAFT, // Client must activate
            },
        });

        // Step 4: Store contract metadata as artifact
        await prisma.artifact.create({
            data: {
                type: ArtifactType.INTAKE_VALIDATION,
                contractId: contract.id,
                data: {
                    invoiceNumber: request.invoiceNumber,
                    poNumber: request.poNumber,
                    settlementTerms: request.settlementTerms,
                    dueDate: request.dueDate?.toISOString(),
                    workType: request.workType,
                    supportingDocs: request.supportingDocs || [],
                    currency: request.currency || 'USD',
                },
            },
        });

        // Step 5: Score the contract
        const scoringResult = await scoreContract({
            contractId: contract.id,
            contractValue: request.amount,
            clientId: request.clientId,
            vendorId: request.vendorId,
        });

        // Step 6: Create event
        await prisma.event.create({
            data: {
                type: EventType.CONTRACT_CREATED,
                contractId: contract.id,
                userId: request.vendorId,
                metadata: {
                    title: request.title,
                    amount: request.amount,
                    clientId: request.clientId,
                },
            },
        });

        // Step 6: Create payment schedule if provided
        if (request.paymentSchedule && request.paymentSchedule.length > 0) {
            const scheduleResult = await createPaymentSchedule({
                contractId: contract.id,
                milestones: request.paymentSchedule,
            });

            if (!scheduleResult.success) {
                warnings.push(`Payment schedule creation warning: ${scheduleResult.error}`);
            }
        }

        return {
            success: true,
            contractId: contract.id,
            status: 'CREATED',
            score: scoringResult.score,
            riskTier: scoringResult.riskTier,
            warnings: warnings.length > 0 ? warnings : undefined,
        };
    } catch (error) {
        console.error('Contract creation failed:', error);
        return {
            success: false,
            status: 'FAILED',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLIENT ACTIVATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function activateContract(contractId: string, clientId: string) {
    try {
        const contract = await prisma.contract.findUnique({
            where: { id: contractId },
        });

        if (!contract) {
            return { success: false, error: 'Contract not found' };
        }

        if (contract.clientId !== clientId) {
            return { success: false, error: 'Unauthorized: Not the contract client' };
        }

        if (contract.status !== ContractStatus.DRAFT) {
            return { success: false, error: 'Contract already activated or invalid status' };
        }

        // Update contract to ACTIVE
        await prisma.contract.update({
            where: { id: contractId },
            data: { status: ContractStatus.ACTIVE },
        });

        // Create activation event
        await prisma.event.create({
            data: {
                type: EventType.CONTRACT_ACTIVATED,
                contractId,
                userId: clientId,
                metadata: {
                    activatedAt: new Date().toISOString(),
                },
            },
        });

        return { success: true, status: 'ACTIVATED' };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

export * from '@contrack/database';
