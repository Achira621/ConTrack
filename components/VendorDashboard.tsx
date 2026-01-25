import React from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, DollarSign, Upload } from 'lucide-react';
import type { User } from '../types';

interface VendorDashboardProps {
    user: User;
    onLogout: () => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({ user, onLogout }) => {
    const stats = [
        { label: 'Available Contracts', value: '8', icon: Package, color: 'text-blue-600 bg-blue-50' },
        { label: 'In Progress', value: '2', icon: Clock, color: 'text-orange-600 bg-orange-50' },
        { label: 'Completed', value: '15', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Earnings', value: '$32,500', icon: DollarSign, color: 'text-purple-600 bg-purple-50' },
    ];

    return (
        <div className="min-h-screen bg-white text-stone-900 font-sans">
            <div className="bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Vendor Dashboard</h1>
                    <p className="text-sm text-stone-500">Welcome back, {user.name || user.email}</p>
                </div>
                <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg text-stone-700 transition-colors"
                >
                    Logout
                </button>
            </div>

            <div className="max-w-7xl mx-auto p-6 space-y-6">
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
                                    <p className="text-3xl font-bold text-stone-900 mt-1">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
                    <h2 className="text-xl font-semibold text-stone-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="p-4 bg-stone-900 hover:bg-stone-800 border border-stone-900 rounded-lg text-white font-medium transition-all group flex items-center justify-between shadow-md">
                            Browse Contracts
                            <Package className="w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <button className="p-4 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-medium transition-all group flex items-center justify-between hover:border-emerald-500/50">
                            Submit Proof of Work
                            <Upload className="w-5 h-5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <button className="p-4 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-medium transition-all group flex items-center justify-between hover:border-purple-500/50">
                            Request Payout
                            <DollarSign className="w-5 h-5 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
                    <h2 className="text-xl font-semibold text-stone-900 mb-4">Available Contracts</h2>
                    <div className="flex flex-col items-center justify-center py-12 text-stone-400 bg-stone-50 rounded-lg border border-stone-200 border-dashed">
                        <Package className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-sm">Browse the contract marketplace to find work opportunities!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
