import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NeonAuthUIProvider, useAuthContext } from '@neondatabase/auth-ui';
import { auth } from '../lib/neonAuth';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();

    // Try to get user from auth context if available
    let user = null;
    let isLoading = false;

    try {
        const authContext = useAuthContext();
        user = authContext?.user;
        isLoading = authContext?.isPending || false;
    } catch {
        // If not inside provider, user is null
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-8">
            <div className="text-center max-w-2xl">
                <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
                    Welcome to <span className="text-purple-400">ConTrack</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                    Intelligent Contract Management powered by AI and blockchain technology.
                </p>

                {user ? (
                    <div className="space-y-4">
                        <p className="text-green-400 text-lg">
                            ✓ Logged in as {user.email}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                            >
                                Go to Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/account')}
                                className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-lg font-semibold transition-all"
                            >
                                Account Settings
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/auth')}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
                        >
                            Sign In with Google
                        </button>
                        <p className="text-gray-400 text-sm">
                            Secure authentication powered by Neon
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
