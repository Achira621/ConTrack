import React, { useState } from 'react';
import PaymentTracker from './PaymentTracker';
import PaymentScheduleView from './PaymentScheduleView';
import PaymentHistory from './PaymentHistory';
import { PaymentProgress, Payment, PaymentSchedule, PaymentStatus } from '../types';

export const PaymentDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'tracker' | 'schedule' | 'history'>('tracker');

    // Dummy Data
    const contractTotal = 15000;

    const initialSchedules: PaymentSchedule[] = [
        {
            id: '1',
            contractId: 'demo-contract',
            milestoneName: 'Initial Deposit',
            description: 'Upfront payment to commence work',
            amount: 4500, // 30%
            percentage: 30,
            dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
            order: 1,
            createdAt: new Date().toISOString(),
        },
        {
            id: '2',
            contractId: 'demo-contract',
            milestoneName: 'Design Approval',
            description: 'Completion of high-fidelity mockups',
            amount: 6000, // 40%
            percentage: 40,
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days from now
            order: 2,
            createdAt: new Date().toISOString(),
        },
        {
            id: '3',
            contractId: 'demo-contract',
            milestoneName: 'Final Delivery',
            description: 'Code handover and deployment',
            amount: 4500, // 30%
            percentage: 30,
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days from now
            order: 3,
            createdAt: new Date().toISOString(),
        },
    ];

    const initialPayments: Payment[] = [
        {
            id: 'p1',
            contractId: 'demo-contract',
            scheduleId: '1',
            amount: 4500,
            status: 'COMPLETED' as PaymentStatus,
            payerId: 'client-1',
            payeeId: 'vendor-1',
            paymentMethod: 'Bank Transfer',
            transactionId: 'TXN-987654321',
            paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
        },
    ];

    // State for interactivity
    const [schedules] = useState<PaymentSchedule[]>(initialSchedules);
    const [payments, setPayments] = useState<Payment[]>(initialPayments);

    // Derived state
    const totalPaid = payments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0);

    const percentageComplete = (totalPaid / contractTotal) * 100;
    const remainingAmount = contractTotal - totalPaid;

    // Filter upcoming payments (milestones not fully paid)
    const upcomingPayments = schedules.filter(s => {
        const paidForSchedule = payments
            .filter(p => p.scheduleId === s.id && p.status === 'COMPLETED')
            .reduce((sum, p) => sum + p.amount, 0);
        return paidForSchedule < s.amount;
    });

    const progress: PaymentProgress = {
        totalAmount: contractTotal,
        totalPaid,
        remainingAmount,
        percentageComplete,
        upcomingPayments,
        completedPayments: payments,
    };

    const handleMarkPaid = (scheduleId: string) => {
        const schedule = schedules.find(s => s.id === scheduleId);
        if (!schedule) return;

        const newPayment: Payment = {
            id: `p-${Date.now()}`,
            contractId: 'demo-contract',
            scheduleId: schedule.id,
            amount: schedule.amount,
            status: 'COMPLETED',
            payerId: 'client-1',
            payeeId: 'vendor-1',
            paymentMethod: 'Credit Card',
            transactionId: `TXN-${Math.floor(Math.random() * 1000000)}`,
            paidAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
        };

        setPayments([newPayment, ...payments]);
    };

    const handleSendReminder = (scheduleId: string) => {
        alert(`Reminder sent for schedule ${scheduleId}`);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-bold text-gray-900">Payment System Demo</h2>
                <p className="text-sm text-gray-500">Contract: Website Redesign Project ($15,000)</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-white">
                <button
                    onClick={() => setActiveTab('tracker')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'tracker'
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Tracker & Progress
                </button>
                <button
                    onClick={() => setActiveTab('schedule')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'schedule'
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Timeline View
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'history'
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Transaction History
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'tracker' && (
                    <PaymentTracker
                        progress={progress}
                        onMarkPaid={handleMarkPaid}
                        onSendReminder={handleSendReminder}
                    />
                )}

                {activeTab === 'schedule' && (
                    <PaymentScheduleView schedules={schedules} showActions={true} />
                )}

                {activeTab === 'history' && (
                    <PaymentHistory payments={payments} />
                )}
            </div>
        </div>
    );
};
