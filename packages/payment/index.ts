// Payment Tracking Module (Payment System)
// Purpose: Manage payment schedules, track payments, and handle payment lifecycle
// Principle: Support both lump-sum and milestone-based payments

import { prisma, PaymentStatus, EventType, ArtifactType } from '@contrack/database';
import { sendNotification } from '@contrack/notification';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES & INTERFACES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface PaymentMilestone {
    name: string;
    description?: string;
    percentage: number; // 0-100
    dueDate?: Date;
}

export interface CreatePaymentScheduleRequest {
    contractId: string;
    milestones: PaymentMilestone[];
}

export interface RecordPaymentRequest {
    contractId: string;
    scheduleId?: string; // Optional - for milestone payments
    amount: number;
    payerId: string;
    payeeId: string;
    paymentMethod?: string;
    transactionId?: string;
    metadata?: any;
}

export interface PaymentProgress {
    totalAmount: number;
    totalPaid: number;
    remainingAmount: number;
    percentageComplete: number;
    upcomingPayments: any[];
    completedPayments: any[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CREATE PAYMENT SCHEDULE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function createPaymentSchedule(request: CreatePaymentScheduleRequest) {
    try {
        // Validate contract exists
        const contract = await prisma.contract.findUnique({
            where: { id: request.contractId },
        });

        if (!contract) {
            return { success: false, error: 'Contract not found' };
        }

        // Validate percentages sum to 100
        const totalPercentage = request.milestones.reduce((sum, m) => sum + m.percentage, 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
            return {
                success: false,
                error: `Payment milestones must sum to 100% (current: ${totalPercentage}%)`,
            };
        }

        // Create payment schedules
        const schedules = await Promise.all(
            request.milestones.map((milestone, index) =>
                prisma.paymentSchedule.create({
                    data: {
                        contractId: request.contractId,
                        milestoneName: milestone.name,
                        description: milestone.description,
                        amount: (contract.value * milestone.percentage) / 100,
                        percentage: milestone.percentage,
                        dueDate: milestone.dueDate,
                        order: index + 1,
                    },
                })
            )
        );

        // Update contract remaining amount
        await prisma.contract.update({
            where: { id: request.contractId },
            data: { remainingAmount: contract.value },
        });

        // Create event
        await prisma.event.create({
            data: {
                type: EventType.PAYMENT_SCHEDULE_CREATED,
                contractId: request.contractId,
                metadata: {
                    milestoneCount: request.milestones.length,
                    schedules: schedules.map((s) => ({
                        id: s.id,
                        name: s.milestoneName,
                        amount: s.amount,
                    })),
                },
            },
        });

        return {
            success: true,
            schedules,
        };
    } catch (error) {
        console.error('Payment schedule creation failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RECORD PAYMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function recordPayment(request: RecordPaymentRequest) {
    try {
        const contract = await prisma.contract.findUnique({
            where: { id: request.contractId },
            include: { paymentSchedules: true },
        });

        if (!contract) {
            return { success: false, error: 'Contract not found' };
        }

        // Validate payment doesn't exceed remaining amount
        const remainingAmount = contract.remainingAmount ?? contract.value;
        if (request.amount > remainingAmount + 0.01) {
            return {
                success: false,
                error: `Payment amount ($${request.amount}) exceeds remaining amount ($${remainingAmount})`,
            };
        }

        // Create payment record
        const payment = await prisma.payment.create({
            data: {
                contractId: request.contractId,
                scheduleId: request.scheduleId,
                amount: request.amount,
                status: PaymentStatus.PENDING,
                payerId: request.payerId,
                payeeId: request.payeeId,
                paymentMethod: request.paymentMethod,
                transactionId: request.transactionId,
                metadata: request.metadata,
            },
        });

        // Create event
        await prisma.event.create({
            data: {
                type: EventType.PAYMENT_CREATED,
                contractId: request.contractId,
                userId: request.payerId,
                metadata: {
                    paymentId: payment.id,
                    amount: request.amount,
                    scheduleId: request.scheduleId,
                },
            },
        });

        // Send notification to vendor
        await sendNotification({
            userId: request.payeeId,
            title: 'Payment Initiated',
            message: `Payment of $${request.amount} has been initiated for contract: ${contract.title}`,
            type: 'PAYMENT',
        });

        return {
            success: true,
            payment,
        };
    } catch (error) {
        console.error('Payment recording failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UPDATE PAYMENT STATUS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    metadata?: any
) {
    try {
        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: { contract: true },
        });

        if (!payment) {
            return { success: false, error: 'Payment not found' };
        }

        // Update payment status
        const updatedPayment = await prisma.payment.update({
            where: { id: paymentId },
            data: {
                status,
                paidAt: status === PaymentStatus.COMPLETED ? new Date() : payment.paidAt,
                metadata: metadata ? { ...payment.metadata, ...metadata } : payment.metadata,
            },
        });

        // If completed, update contract totals
        if (status === PaymentStatus.COMPLETED && payment.status !== PaymentStatus.COMPLETED) {
            await prisma.contract.update({
                where: { id: payment.contractId },
                data: {
                    totalPaid: { increment: payment.amount },
                    remainingAmount: { decrement: payment.amount },
                },
            });

            // Create completion event
            await prisma.event.create({
                data: {
                    type: EventType.PAYMENT_COMPLETED,
                    contractId: payment.contractId,
                    userId: payment.payerId,
                    metadata: {
                        paymentId: payment.id,
                        amount: payment.amount,
                    },
                },
            });

            // Notify vendor
            await sendNotification({
                userId: payment.payeeId,
                title: 'Payment Received',
                message: `Payment of $${payment.amount} has been completed for contract: ${payment.contract.title}`,
                type: 'PAYMENT',
            });

            // Check if milestone reached
            if (payment.scheduleId) {
                const schedule = await prisma.paymentSchedule.findUnique({
                    where: { id: payment.scheduleId },
                });

                if (schedule) {
                    await prisma.event.create({
                        data: {
                            type: EventType.MILESTONE_REACHED,
                            contractId: payment.contractId,
                            metadata: {
                                milestoneName: schedule.milestoneName,
                                amount: payment.amount,
                            },
                        },
                    });
                }
            }
        } else if (status === PaymentStatus.FAILED) {
            // Create failure event
            await prisma.event.create({
                data: {
                    type: EventType.PAYMENT_FAILED,
                    contractId: payment.contractId,
                    userId: payment.payerId,
                    metadata: {
                        paymentId: payment.id,
                        amount: payment.amount,
                        reason: metadata?.reason,
                    },
                },
            });

            // Notify both parties
            await sendNotification({
                userId: payment.payerId,
                title: 'Payment Failed',
                message: `Payment of $${payment.amount} has failed. Please try again.`,
                type: 'PAYMENT',
            });
        }

        return {
            success: true,
            payment: updatedPayment,
        };
    } catch (error) {
        console.error('Payment status update failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GET PAYMENT HISTORY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function getPaymentHistory(contractId: string) {
    try {
        const payments = await prisma.payment.findMany({
            where: { contractId },
            include: { schedule: true },
            orderBy: { createdAt: 'desc' },
        });

        return {
            success: true,
            payments,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GET PAYMENT SCHEDULE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function getPaymentSchedule(contractId: string) {
    try {
        const schedules = await prisma.paymentSchedule.findMany({
            where: { contractId },
            include: { payments: true },
            orderBy: { order: 'asc' },
        });

        return {
            success: true,
            schedules,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CALCULATE PAYMENT PROGRESS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function calculatePaymentProgress(contractId: string): Promise<PaymentProgress | null> {
    try {
        const contract = await prisma.contract.findUnique({
            where: { id: contractId },
            include: {
                paymentSchedules: {
                    include: { payments: true },
                    orderBy: { order: 'asc' },
                },
                payments: {
                    where: { status: PaymentStatus.COMPLETED },
                },
            },
        });

        if (!contract) return null;

        const totalPaid = contract.totalPaid;
        const remainingAmount = contract.remainingAmount ?? contract.value - totalPaid;
        const percentageComplete = (totalPaid / contract.value) * 100;

        // Get upcoming payments (schedules not fully paid)
        const upcomingPayments = contract.paymentSchedules.filter((schedule) => {
            const paidForSchedule = schedule.payments
                .filter((p) => p.status === PaymentStatus.COMPLETED)
                .reduce((sum, p) => sum + p.amount, 0);
            return paidForSchedule < schedule.amount;
        });

        return {
            totalAmount: contract.value,
            totalPaid,
            remainingAmount,
            percentageComplete,
            upcomingPayments,
            completedPayments: contract.payments,
        };
    } catch (error) {
        console.error('Payment progress calculation failed:', error);
        return null;
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SEND PAYMENT REMINDER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function sendPaymentReminder(scheduleId: string) {
    try {
        const schedule = await prisma.paymentSchedule.findUnique({
            where: { id: scheduleId },
            include: {
                contract: {
                    include: { client: true, vendor: true },
                },
                payments: true,
            },
        });

        if (!schedule) {
            return { success: false, error: 'Payment schedule not found' };
        }

        const paidAmount = schedule.payments
            .filter((p) => p.status === PaymentStatus.COMPLETED)
            .reduce((sum, p) => sum + p.amount, 0);

        const remainingForMilestone = schedule.amount - paidAmount;

        if (remainingForMilestone <= 0) {
            return { success: false, error: 'Milestone already fully paid' };
        }

        // Send reminder to client
        await sendNotification({
            userId: schedule.contract.clientId,
            title: 'Payment Reminder',
            message: `Reminder: Payment of $${remainingForMilestone} is due for milestone "${schedule.milestoneName}" on contract: ${schedule.contract.title}`,
            type: 'PAYMENT',
        });

        return { success: true };
    } catch (error) {
        console.error('Payment reminder failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

export * from '@contrack/database';
