import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import type { UserRole } from '../types';

interface LoginProps {
    onLogin: (role: UserRole, email: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState<UserRole>('CLIENT');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            onLogin(selectedRole, email);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to ConTrack</h1>
                    <p className="text-gray-600">Sign in to your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            I am a...
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['CLIENT', 'VENDOR', 'INVESTOR'] as UserRole[]).map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setSelectedRole(role)}
                                    className={`py-2 px-4 rounded-lg font-medium transition-all ${selectedRole === role
                                            ? 'bg-indigo-600 text-white shadow-lg scale-105'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {role.charAt(0) + role.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition shadow-lg"
                    >
                        <LogIn size={20} />
                        Sign In as {selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()}
                    </motion.button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Demo Mode - No password required</p>
                </div>
            </motion.div>
        </div>
    );
};
