import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, Users, DollarSign, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { ContractCreationModal } from './ContractCreationModal';
import type { User, Contract } from '../types';

interface ClientDashboardProps {
    user: User;
    onLogout: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ user, onLogout }) => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load contracts from API
    useEffect(() => {
        const fetchContracts = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(`/api/contracts?userId=${user.id}`);

                if (!res.ok) {
                    throw new Error('Failed to load contracts');
                }

                const data = await res.json();

                if (data.success && data.contracts) {
                    setContracts(data.contracts);
                } else {
                    throw new Error(data.error || 'Invalid response format');
                }
            } catch (err) {
                console.error('Failed to load contracts:', err);
                setError(err instanceof Error ? err.message : 'Failed to load contracts');

                // Fallback to localStorage if API fails
                const stored = localStorage.getItem('contracts');
                if (stored) {
                    try {
                        setContracts(JSON.parse(stored));
                    } catch (e) {
                        console.error('Failed to parse stored contracts', e);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchContracts();
    }, [user.id]);

    const handleCreateContract = async (contractData: any) => {
        setError(null);

        try {
            const res = await fetch('/api/contracts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...contractData,
                    clientId: user.id,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to create contract');
            }

            const result = await res.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to create contract');
            }

            // Refresh contracts list
            const refreshRes = await fetch(`/api/contracts?userId=${user.id}`);
            if (refreshRes.ok) {
                const data = await refreshRes.json();
                if (data.success && data.contracts) {
                    setContracts(data.contracts);
                }
            }

            setShowCreateModal(false);
        } catch (err) {
            console.error('Failed to create contract:', err);
            setError(err instanceof Error ? err.message : 'Failed to create contract');

            // Fallback to localStorage
            const newContract: Contract = {
                id: crypto.randomUUID(),
                title: contractData.title,
                description: contractData.description,
                value: contractData.value,
                status: 'DRAFT',
                clientId: user.id,
                vendorId: contractData.vendorEmail,
                createdAt: new Date().toISOString(),
            };

            const updated = [...contracts, newContract];
            setContracts(updated);
            localStorage.setItem('contracts', JSON.stringify(updated));
            setShowCreateModal(false);
        }
    };

    const activeContracts = contracts.filter(c => c.status === 'ACTIVE').length;
    const totalValue = contracts.reduce((sum, c) => sum + c.value, 0);
    const settledContracts = contracts.filter(c => c.status === 'SETTLED').length;

    const stats = [
        { label: 'Active Contracts', value: activeContracts.toString(), icon: FileText, color: 'text-blue-600 bg-blue-50' },
        { label: 'Total Value', value: `$${totalValue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Pending Approvals', value: '1', icon: Users, color: 'text-orange-600 bg-orange-50' },
        { label: 'Settled', value: settledContracts.toString(), icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-300';
            case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-300';
            case 'SETTLED': return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'DISPUTED': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <div className="min-h-screen bg-white text-stone-900 font-sans">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Client Dashboard</h1>
                    <p className="text-sm text-stone-500">Welcome back, {user.name || user.email}</p>
                </div>
                <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg text-stone-700 transition-colors"
                >
                    Logout
                </button>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Error Banner */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-900">Error</p>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-600 hover:text-red-800"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm hover:border-emerald-500/30 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-stone-500 font-medium">{stat.label}</p>
                                    <p className="text-3xl font-bold text-stone-900 mt-1 tracking-tight">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
                    <h2 className="text-xl font-semibold text-stone-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="p-4 bg-stone-900 hover:bg-stone-800 border border-stone-900 rounded-lg text-white font-medium transition-all group flex items-center justify-between shadow-md hover:shadow-lg"
                        >
                            Create New Contract
                            <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </button>
                        <button className="p-4 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-medium transition-all group flex items-center justify-between hover:border-emerald-500/50">
                            Approve Work
                            <span className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </button>
                        <button className="p-4 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-medium transition-all group flex items-center justify-between hover:border-purple-500/50">
                            View Reports
                            <span className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </button>
                    </div>
                </div>

                {/* Recent Contracts */}
                <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
                    <h2 className="text-xl font-semibold text-stone-900 mb-4">Recent Contracts</h2>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-stone-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-3" />
                            <p className="text-sm">Loading contracts...</p>
                        </div>
                    ) : contracts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-stone-400 bg-stone-50 rounded-lg border border-stone-200 border-dashed">
                            <FileText className="w-12 h-12 mb-3 opacity-20" />
                            <p className="text-sm">No contracts yet. Create your first contract to get started!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {contracts.slice(0, 5).map((contract) => (
                                <motion.div
                                    key={contract.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-4 bg-stone-50 rounded-lg border border-stone-200 hover:border-emerald-500/30 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-stone-900">{contract.title}</h3>
                                            {contract.description && (
                                                <p className="text-sm text-stone-600 mt-1">{contract.description}</p>
                                            )}
                                            <div className="flex items-center gap-4 mt-2 text-xs text-stone-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(contract.createdAt)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="w-3 h-3" />
                                                    ${contract.value.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(contract.status)}`}>
                                            {contract.status}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Contract Creation Modal */}
            <ContractCreationModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateContract}
                user={user}
            />
        </div>
    );
};
