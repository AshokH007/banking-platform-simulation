import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('CLIENT'); // CLIENT or STAFF
    const [isLoading, setIsLoading] = useState(false);
    const { login, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await login(identifier, password);
        setIsLoading(false);
        if (success) {
            navigate('/dashboard');
        }
    };

    const isStaff = role === 'STAFF';

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full animate-in fade-in duration-700">
                {/* Role Switcher */}
                <div className="flex justify-center mb-8">
                    <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                        <button
                            onClick={() => setRole('CLIENT')}
                            className={clsx(
                                "px-6 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300",
                                !isStaff ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            Customer
                        </button>
                        <button
                            onClick={() => setRole('STAFF')}
                            className={clsx(
                                "px-6 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300",
                                isStaff ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            Staff Portal
                        </button>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h1 className={clsx(
                        "text-3xl font-semibold tracking-tight mb-2 transition-colors duration-500",
                        isStaff ? "text-indigo-900" : "text-slate-900"
                    )}>
                        {isStaff ? 'Secure Staff Access' : 'Secure Customer Login'}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {isStaff
                            ? 'Authorized bank personnel only. Audit logs are active.'
                            : 'Please enter your authenticated credentials to manage your accounts.'
                        }
                    </p>
                </div>

                <div className={clsx(
                    "bg-white rounded-2xl shadow-xl border p-8 md:p-10 transition-all duration-500",
                    isStaff ? "border-indigo-100 shadow-indigo-100/50" : "border-slate-100 shadow-slate-200/50"
                )}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
                                {isStaff ? 'Staff ID / Email' : 'Email or Customer ID'}
                            </label>
                            <input
                                type="text"
                                required
                                className={clsx(
                                    "w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 placeholder:text-slate-300",
                                    isStaff
                                        ? "border-indigo-100 focus:ring-indigo-900/5 focus:border-indigo-600/40"
                                        : "border-slate-200 focus:ring-slate-900/5 focus:border-slate-900/40"
                                )}
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
                                className={clsx(
                                    "w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 placeholder:text-slate-300",
                                    isStaff
                                        ? "border-indigo-100 focus:ring-indigo-900/5 focus:border-indigo-600/40"
                                        : "border-slate-200 focus:ring-slate-900/5 focus:border-slate-900/40"
                                )}
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
                                "w-full text-white font-semibold py-4 rounded-xl transition-all duration-300 transform active:scale-[0.98]",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                isStaff
                                    ? "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-900/20"
                                    : "bg-slate-900 hover:bg-slate-800 hover:shadow-slate-900/20"
                            )}
                        >
                            {isLoading ? 'Verifying Authentication...' : 'Secure Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                        <p className="text-xs text-slate-400">
                            {isStaff ? 'Report login issues to IT Support' : 'Need assistance? Contact our secure support desk.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
