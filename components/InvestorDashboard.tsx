import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, PieChart, BarChart3, ArrowRight } from 'lucide-react';
import type { User } from '../types';

interface InvestorDashboardProps {
    user: User;
    onLogout: () => void;
}

export const InvestorDashboard: React.FC<InvestorDashboardProps> = ({ user, onLogout }) => {
    const stats = [
        { label: 'Total Investment', value: '$50,000', icon: Wallet, color: 'text-blue-600 bg-blue-50' },
        { label: 'Current NAV', value: '1.08', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Total Return', value: '+8%', icon: BarChart3, color: 'text-purple-600 bg-purple-50' },
        { label: 'Active Pools', value: '3', icon: PieChart, color: 'text-orange-600 bg-orange-50' },
    ];

    const pools = [
        { name: 'Low Risk Pool', risk: 'LOW', nav: 1.05, apy: '5.2%', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
        { name: 'Medium Risk Pool', risk: 'MEDIUM', nav: 1.12, apy: '12.8%', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
        { name: 'High Risk Pool', risk: 'HIGH', nav: 1.23, apy: '23.1%', color: 'bg-red-50 text-red-800 border-red-200' },
    ];

    return (
        <div className="min-h-screen bg-white text-stone-900 font-sans">
            <div className="bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Investor Dashboard</h1>
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
                {/* Portfolio Stats */}
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

                {/* Investment Pools */}
                <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
                    <h2 className="text-xl font-semibold text-stone-900 mb-4">Investment Pools</h2>
                    <div className="space-y-4">
                        {pools.map((pool, idx) => (
                            <motion.div
                                key={pool.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-4 border border-stone-200 bg-white rounded-lg hover:bg-stone-50 transition cursor-pointer group shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-stone-900">{pool.name}</h3>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${pool.color}`}>
                                                {pool.risk} RISK
                                            </span>
                                            <span className="text-sm text-stone-500">NAV: {pool.nav}</span>
                                            <span className="text-sm text-emerald-600 font-medium">APY: {pool.apy}</span>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors flex items-center gap-2">
                                        Invest <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* NAV Chart Placeholder */}
                <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
                    <h2 className="text-xl font-semibold text-stone-900 mb-4">Portfolio Performance</h2>
                    <div className="h-64 flex items-center justify-center bg-stone-50 rounded-lg border-2 border-dashed border-stone-200">
                        <div className="text-center">
                            <TrendingUp className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                            <p className="text-stone-400">NAV Chart (Coming Soon)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
