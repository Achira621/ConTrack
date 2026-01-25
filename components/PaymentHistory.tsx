import React, { useState } from 'react';
import { Payment, PaymentStatus } from '../types';
import { Search, Download, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface PaymentHistoryProps {
    payments: Payment[];
    onExport?: () => void;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments, onExport }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'ALL'>('ALL');
    const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const getStatusIcon = (status: PaymentStatus) => {
        switch (status) {
            case 'COMPLETED':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'PENDING':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'PROCESSING':
                return <AlertCircle className="w-4 h-4 text-blue-500" />;
            case 'FAILED':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'PROCESSING':
                return 'bg-blue-100 text-blue-800';
            case 'FAILED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Filter and sort payments
    const filteredPayments = payments
        .filter((payment) => {
            const matchesSearch =
                searchTerm === '' ||
                payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.amount.toString().includes(searchTerm);
            const matchesStatus = filterStatus === 'ALL' || payment.status === filterStatus;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'date') {
                comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else {
                comparison = a.amount - b.amount;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

    return (
        <div className="payment-history">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Payment History</h3>
                    {onExport && (
                        <button
                            onClick={onExport}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    )}
                </div>

                {/* Filters and Search */}
                <div className="flex flex-wrap gap-4 mb-6">
                    {/* Search */}
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by transaction ID or amount..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as PaymentStatus | 'ALL')}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                        <option value="ALL">All Status</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="FAILED">Failed</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                            const [by, order] = e.target.value.split('-');
                            setSortBy(by as 'date' | 'amount');
                            setSortOrder(order as 'asc' | 'desc');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="amount-desc">Highest Amount</option>
                        <option value="amount-asc">Lowest Amount</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Method</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Transaction ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((payment) => (
                                    <tr
                                        key={payment.id}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <td className="py-3 px-4 text-sm text-gray-900">
                                            {formatDate(payment.paidAt || payment.createdAt)}
                                        </td>
                                        <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                                            {formatCurrency(payment.amount)}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(payment.status)}
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                                                    {payment.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            {payment.paymentMethod || 'N/A'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 font-mono">
                                            {payment.transactionId || '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-gray-500">
                                        No payments found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                {filteredPayments.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">
                                Showing {filteredPayments.length} of {payments.length} payments
                            </span>
                            <span className="text-gray-900 font-bold text-lg">
                                Total: {formatCurrency(filteredPayments.reduce((sum, p) => sum + p.amount, 0))}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentHistory;
