import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, useAuthContext } from '@neondatabase/auth-ui';
import { auth } from '../lib/neonAuth';

export const AccountPage: React.FC = () => {
    const navigate = useNavigate();

    let user = null;
    try {
        const authContext = useAuthContext();
        user = authContext?.user;
    } catch {
        // Not inside provider
    }

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            navigate('/');
        } catch (error) {
            console.error('Sign out error:', error);
            navigate('/');
        }
    };

    if (!user) {
        navigate('/auth');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Account Settings</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-white mb-2">Profile</h2>
                        <p className="text-gray-300">Email: {user.email}</p>
                    </div>

                    <Settings />

                    <div className="mt-8 pt-6 border-t border-white/10">
                        <button
                            onClick={handleSignOut}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all w-full"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
