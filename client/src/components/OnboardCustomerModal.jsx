import React, { useState } from 'react';
import axios from 'axios';

const OnboardCustomerModal = ({ isOpen, onClose, onSuccess, API_BASE }) => {
    const [formData, setFormData] = useState({ fullName: '', email: '', initialDeposit: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const res = await axios.post(`${API_BASE}/api/staff/create-customer`, {
                ...formData,
                initialDeposit: parseFloat(formData.initialDeposit) || 0
            });
            setResult(res.data);
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to onboard customer');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl shadow-indigo-900/40 relative overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header Decoration */}
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                <div className="p-10">
                    {!result ? (
                        <>
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-slate-900">Onboard Customer</h3>
                                <p className="text-slate-400 text-sm mt-1">Create a new banking identity</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                                    <input
                                        type="text" required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                                        placeholder="e.g. Alice Johnson"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                                    <input
                                        type="email" required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                                        placeholder="alice@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Initial Deposit ($)</label>
                                    <input
                                        type="number"
                                        value={formData.initialDeposit}
                                        onChange={(e) => setFormData({ ...formData, initialDeposit: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                                        placeholder="0.00"
                                    />
                                </div>

                                {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button" onClick={onClose}
                                        className="flex-1 px-8 py-4 rounded-2xl border border-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit" disabled={isLoading}
                                        className="flex-3 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50">
                                        {isLoading ? 'Processing...' : 'Register Customer'}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6 animate-in slide-in-from-bottom-4">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Success!</h3>
                            <p className="text-slate-500 text-sm mb-8">Customer id <span className="text-indigo-600 font-bold">{result.user.customer_id}</span> is live.</p>

                            <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-3 border border-slate-100 mb-8">
                                <div className="flex justify-between">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Account #</span>
                                    <span className="text-xs font-mono font-bold text-slate-700">{result.user.account_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Default Password</span>
                                    <span className="text-xs font-bold text-slate-700">{result.defaultPassword}</span>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors">
                                Close & Sync
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardCustomerModal;
