// Notification Layer - Event-Driven Messaging
// Purpose: Communicate lifecycle events without blocking flows
// Principle: Silent/de-escalated on failure, no crashes

import { prisma } from '@contrack/database';
import type { EventType } from '@contrack/database';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTIFICATION TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface Notification {
    recipient: string; // User ID or email
    type: EventType;
    title: string;
    message: string;
    metadata?: Record<string, any>;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTIFICATION TEMPLATES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const TEMPLATES: Record<EventType, (data: any) => { title: string; message: string; priority: string }> = {
    CONTRACT_CREATED: (data) => ({
        title: 'New Contract Created',
        message: `Contract "${data.title}" has been created and is pending client activation.`,
        priority: 'MEDIUM',
    }),
    CONTRACT_ACTIVATED: (data) => ({
        title: 'Contract Activated',
        message: `Contract "${data.title}" has been activated by the client.`,
        priority: 'HIGH',
    }),
    CONTRACT_SETTLED: (data) => ({
        title: 'Settlement Complete',
        message: `Contract settled successfully. Amount: $${data.amount}.`,
        priority: 'HIGH',
    }),
    EXPOSURE_CREATED: (data) => ({
        title: 'Pool Exposure Created',
        message: `${data.poolName} is now underwriting your contract for $${data.exposureAmount}.`,
        priority: 'MEDIUM',
    }),
    EXPOSURE_SETTLED: (data) => ({
        title: 'Exposure Settled',
        message: `Pool exposure resolved. Return: $${data.poolReturn}.`,
        priority: 'MEDIUM',
    }),
    EXPOSURE_DEFAULTED: (data) => ({
        title: 'Contract Default',
        message: `Contract has defaulted. Recovery process initiated.`,
        priority: 'URGENT',
    }),
    POOL_INVESTMENT: (data) => ({
        title: 'Investment Confirmed',
        message: `You purchased ${data.units} units at NAV ${data.nav}.`,
        priority: 'MEDIUM',
    }),
    POOL_REDEMPTION: (data) => ({
        title: 'Redemption Processed',
        message: `${data.units} units redeemed for $${data.amount}.`,
        priority: 'MEDIUM',
    }),
    NAV_UPDATED: (data) => ({
        title: 'Pool NAV Updated',
        message: `NAV changed from ${data.oldNAV} to ${data.newNAV}.`,
        priority: 'LOW',
    }),
    USER_ACTION: (data) => ({
        title: data.title || 'Action Required',
        message: data.message || 'Please review your dashboard.',
        priority: 'MEDIUM',
    }),
    SYSTEM_ERROR: (data) => ({
        title: 'System Notice',
        message: data.message || 'A system event occurred.',
        priority: 'LOW',
    }),
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN NOTIFICATION HANDLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function sendNotification(notification: Notification): Promise<{ success: boolean; error?: string }> {
    try {
        // In a real implementation, this would:
        // - Send email via SendGrid/AWS SES
        // - Push to mobile app via Firebase
        // - Send webhook to external service
        // - Queue in message broker (RabbitMQ/Redis)

        // For now, we just log it to the database
        console.log(`[NOTIFICATION] ${notification.priority}: ${notification.title} -> ${notification.recipient}`);

        // Store notification in database for user to view later
        await prisma.event.create({
            data: {
                type: 'USER_ACTION' as EventType,
                metadata: {
                    notificationType: 'NOTIFICATION_SENT',
                    recipient: notification.recipient,
                    title: notification.title,
                    message: notification.message,
                    priority: notification.priority,
                },
            },
        });

        return { success: true };
    } catch (error) {
        // Fail silently - notifications should never block the main flow
        console.error('Notification failed (non-blocking):', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENT-BASED NOTIFICATION TRIGGER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function notifyFromEvent(eventType: EventType, recipient: string, eventData: any) {
    try {
        const template = TEMPLATES[eventType];
        if (!template) {
            console.warn(`No notification template for event type: ${eventType}`);
            return { success: false, error: 'No template' };
        }

        const { title, message, priority } = template(eventData);

        return await sendNotification({
            recipient,
            type: eventType,
            title,
            message,
            metadata: eventData,
            priority: priority as any,
        });
    } catch (error) {
        // Silent fallback
        return { success: false, error: 'Template rendering failed' };
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BATCH NOTIFICATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function sendBatchNotifications(notifications: Notification[]) {
    const results = await Promise.allSettled(
        notifications.map((n: Notification) => sendNotification(n))
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    return {
        total: notifications.length,
        successful,
        failed: notifications.length - successful,
    };
}

export * from '@contrack/database';
