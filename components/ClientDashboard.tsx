import React from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, Users, DollarSign } from 'lucide-react';
import type { User } from '../types';

interface ClientDashboardProps {
    user: User;
    onLogout: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ user, onLogout }) => {
    const stats = [
        { label: 'Active Contracts', value: '3', icon: FileText, color: 'text-blue-600 bg-blue-50' },
        { label: 'Total Value', value: '$45,000', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Pending Approvals', value: '1', icon: Users, color: 'text-orange-600 bg-orange-50' },
        { label: 'Settled', value: '12', icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
    ];

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
                        <button className="p-4 bg-stone-900 hover:bg-stone-800 border border-stone-900 rounded-lg text-white font-medium transition-all group flex items-center justify-between shadow-md hover:shadow-lg">
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
                    <div className="flex flex-col items-center justify-center py-12 text-stone-400 bg-stone-50 rounded-lg border border-stone-200 border-dashed">
                        <FileText className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-sm">No contracts yet. Create your first contract to get started!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
