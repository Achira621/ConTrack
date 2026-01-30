import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignIn } from '@neondatabase/auth-ui';

export const AuthPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
                    <p className="text-gray-300">Access your ConTrack dashboard</p>
                </div>

                <SignIn
                    redirectTo="/dashboard"
                    onSuccess={() => {
                        navigate('/dashboard');
                    }}
                />

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
