import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, error } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await login(identifier, password);
        setIsLoading(false);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full animate-in fade-in duration-700">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 mb-2">
                        Secure Customer Login
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Please enter your authenticated credentials to manage your accounts.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
                                Email or Customer ID
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900/40 transition-all duration-200 placeholder:text-slate-300"
                                placeholder="Required"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900/40 transition-all duration-200 placeholder:text-slate-300"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={clsx(
                                "w-full bg-slate-900 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform active:scale-[0.98]",
                                "hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20",
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                        >
                            {isLoading ? 'Verifying Secure Access...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                        <p className="text-xs text-slate-400">
                            Need assistance? Contact our secure support desk.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
