import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Set JSON content type
    res.setHeader('Content-Type', 'application/json');

    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'POST') {
            // Create new contract
            const { title, description, clientId, vendorEmail, value, milestones } = req.body;

            // Validation
            if (!title || title.length < 3) {
                return res.status(400).json({
                    success: false,
                    error: 'Title is required (minimum 3 characters)'
                });
            }

            if (!clientId) {
                return res.status(400).json({
                    success: false,
                    error: 'Client ID is required'
                });
            }

            if (!value || parseFloat(value) <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Contract value must be greater than 0'
                });
            }

            // Find or create vendor by email
            let vendor = null;
            if (vendorEmail) {
                vendor = await prisma.user.upsert({
                    where: { email: vendorEmail },
                    create: {
                        email: vendorEmail,
                        role: 'VENDOR',
                        name: vendorEmail.split('@')[0],
                    },
                    update: {},
                });
            }

            // Create contract
            const contract = await prisma.contract.create({
                data: {
                    title,
                    description: description || null,
                    value: parseFloat(value),
                    status: 'DRAFT',
                    clientId,
                    vendorId: vendor?.id || null,
                    remainingAmount: parseFloat(value),
                },
            });

            // Create payment schedules if milestones provided
            if (milestones && milestones.length > 0) {
                // Validate percentages
                const totalPercentage = milestones.reduce((sum: number, m: any) => sum + (m.percentage || 0), 0);

                if (Math.abs(totalPercentage - 100) > 0.01) {
                    // Delete the contract since milestone validation failed
                    await prisma.contract.delete({ where: { id: contract.id } });
                    return res.status(400).json({
                        success: false,
                        error: `Payment milestones must sum to 100% (current: ${totalPercentage}%)`,
                    });
                }

                // Create payment schedules
                await Promise.all(
                    milestones.map((milestone: any, index: number) =>
                        prisma.paymentSchedule.create({
                            data: {
                                contractId: contract.id,
                                milestoneName: milestone.name,
                                description: milestone.description || null,
                                amount: (parseFloat(value) * milestone.percentage) / 100,
                                percentage: milestone.percentage,
                                dueDate: milestone.dueDate ? new Date(milestone.dueDate) : null,
                                order: index + 1,
                            },
                        })
                    )
                );

                // Create event
                await prisma.event.create({
                    data: {
                        type: 'PAYMENT_SCHEDULE_CREATED',
                        contractId: contract.id,
                        userId: clientId,
                        metadata: {
                            milestoneCount: milestones.length,
                        },
                    },
                });
            }

            // Create contract creation event
            await prisma.event.create({
                data: {
                    type: 'CONTRACT_CREATED',
                    contractId: contract.id,
                    userId: clientId,
                    metadata: {
                        title: contract.title,
                        value: contract.value,
                    },
                },
            });

            // Fetch contract with relations
            const fullContract = await prisma.contract.findUnique({
                where: { id: contract.id },
                include: {
                    paymentSchedules: true,
                    client: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                        },
                    },
                    vendor: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                        },
                    },
                },
            });

            return res.status(201).json({
                success: true,
                contract: fullContract,
            });
        } else if (req.method === 'GET') {
            // Get contracts for user
            const { userId } = req.query;

            if (!userId || typeof userId !== 'string') {
                return res.status(400).json({
                    success: false,
                    error: 'User ID is required'
                });
            }

            const contracts = await prisma.contract.findMany({
                where: {
                    OR: [
                        { clientId: userId },
                        { vendorId: userId },
                    ],
                },
                include: {
                    paymentSchedules: {
                        orderBy: { order: 'asc' },
                    },
                    payments: {
                        where: { status: 'COMPLETED' },
                    },
                    client: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                        },
                    },
                    vendor: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });

            return res.status(200).json({
                success: true,
                contracts
            });
        } else {
            return res.status(405).json({
                success: false,
                error: 'Method not allowed'
            });
        }
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error',
        });
    }
}
