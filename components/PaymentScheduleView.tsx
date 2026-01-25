import React from 'react';
import { PaymentSchedule } from '../types';
import { Calendar, DollarSign, CheckCircle2 } from 'lucide-react';

interface PaymentScheduleViewProps {
    schedules: PaymentSchedule[];
    showActions?: boolean;
    onEdit?: (scheduleId: string) => void;
    onDelete?: (scheduleId: string) => void;
}

const PaymentScheduleView: React.FC<PaymentScheduleViewProps> = ({
    schedules,
    showActions = false,
    onEdit,
    onDelete,
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No due date';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const sortedSchedules = [...schedules].sort((a, b) => a.order - b.order);

    return (
        <div className="payment-schedule-view">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Schedule</h3>

                {/* Timeline View */}
                <div className="relative">
                    {sortedSchedules.map((schedule, index) => (
                        <div key={schedule.id} className="relative pb-8 last:pb-0">
                            {/* Timeline Line */}
                            {index < sortedSchedules.length - 1 && (
                                <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-300" />
                            )}

                            {/* Milestone Card */}
                            <div className="flex gap-4">
                                {/* Timeline Marker */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm z-10 relative">
                                        {schedule.order}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-green-500 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900">{schedule.milestoneName}</h4>
                                            {schedule.description && (
                                                <p className="text-sm text-gray-600 mt-1">{schedule.description}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-green-600">{formatCurrency(schedule.amount)}</p>
                                            <p className="text-sm text-gray-500">{schedule.percentage}%</p>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>Due: {formatDate(schedule.dueDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="w-4 h-4" />
                                            <span>{formatCurrency(schedule.amount)}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {showActions && (onEdit || onDelete) && (
                                        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(schedule.id)}
                                                    className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(schedule.id)}
                                                    className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Total Milestones:</span>
                        <span className="text-gray-900 font-bold">{schedules.length}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-700 font-medium">Total Amount:</span>
                        <span className="text-green-600 font-bold text-xl">
                            {formatCurrency(schedules.reduce((sum, s) => sum + s.amount, 0))}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentScheduleView;
