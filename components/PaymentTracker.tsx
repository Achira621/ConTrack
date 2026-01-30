import React from 'react';
import { PaymentProgress, PaymentStatus } from '../types';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface PaymentTrackerProps {
    progress: PaymentProgress;
    onMarkPaid?: (scheduleId: string) => void;
    onSendReminder?: (scheduleId: string) => void;
}

const PaymentTracker: React.FC<PaymentTrackerProps> = ({ progress, onMarkPaid, onSendReminder }) => {
    const getStatusIcon = (status: PaymentStatus) => {
        switch (status) {
            case 'COMPLETED':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'PENDING':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'PROCESSING':
                return <AlertCircle className="w-5 h-5 text-blue-500" />;
            case 'FAILED':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'PROCESSING':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'FAILED':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="payment-tracker">
            {/* Progress Overview */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Progress</h3>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            {formatCurrency(progress.totalPaid)} of {formatCurrency(progress.totalAmount)}
                        </span>
                        <span className="text-sm font-bold text-green-600">
                            {progress.percentageComplete.toFixed(1)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${Math.min(progress.percentageComplete, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(progress.totalAmount)}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Paid</p>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(progress.totalPaid)}</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Remaining</p>
                        <p className="text-lg font-bold text-yellow-600">{formatCurrency(progress.remainingAmount)}</p>
                    </div>
                </div>
            </div>

            {/* Upcoming Payments */}
            {progress.upcomingPayments.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Upcoming Milestones</h4>
                    <div className="space-y-3">
                        {progress.upcomingPayments.map((schedule) => (
                            <div
                                key={schedule.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-500 transition-colors"
                            >
                                <div className="flex-1">
                                    <h5 className="font-semibold text-gray-900">{schedule.milestoneName}</h5>
                                    {schedule.description && (
                                        <p className="text-sm text-gray-600 mt-1">{schedule.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-sm text-gray-500">
                                            Due: {formatDate(schedule.dueDate)}
                                        </span>
                                        <span className="text-sm font-medium text-green-600">
                                            {schedule.percentage}%
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <p className="text-xl font-bold text-gray-900">{formatCurrency(schedule.amount)}</p>
                                    <div className="flex gap-2">
                                        {onMarkPaid && (
                                            <button
                                                onClick={() => onMarkPaid(schedule.id)}
                                                className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                                            >
                                                Mark Paid
                                            </button>
                                        )}
                                        {onSendReminder && (
                                            <button
                                                onClick={() => onSendReminder(schedule.id)}
                                                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                                            >
                                                Remind
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Completed Payments */}
            {progress.completedPayments.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Payment History</h4>
                    <div className="space-y-2">
                        {progress.completedPayments.map((payment) => (
                            <div
                                key={payment.id}
                                className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                            >
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(payment.status)}
                                    <div>
                                        <p className="font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                                        <p className="text-xs text-gray-600">
                                            {formatDate(payment.paidAt || payment.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(payment.status)}`}>
                                    {payment.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {progress.upcomingPayments.length === 0 && progress.completedPayments.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Payment Schedule</h4>
                    <p className="text-gray-600">This contract uses a single lump-sum payment.</p>
                </div>
            )}
        </div>
    );
};

export default PaymentTracker;
