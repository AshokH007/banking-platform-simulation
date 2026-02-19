import React, { useState } from 'react';
import axios from 'axios';

const FundInjectionModal = ({ isOpen, onClose, onSuccess, API_BASE, initialAccountNumber = '' }) => {
    const [formData, setFormData] = useState({ accountNumber: initialAccountNumber, amount: '', reference: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Sync initial account number if it changes (e.g. when clicking a specific user)
    React.useEffect(() => {
        if (initialAccountNumber) {
            setFormData(prev => ({ ...prev, accountNumber: initialAccountNumber }));
        }
    }, [initialAccountNumber]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await axios.post(`${API_BASE}/api/staff/deposit`, {
                accountNumber: formData.accountNumber,
                amount: parseFloat(formData.amount),
                reference: formData.reference || 'Manual Staff Injection'
            });
            setSuccess(true);
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to inject funds');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl shadow-indigo-900/40 relative overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header Decoration */}
                <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>

                <div className="p-10">
                    {!success ? (
                        <>
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-slate-900">Inject Funds</h3>
                                <p className="text-slate-400 text-sm mt-1">Manual liquidity adjustment tool</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Account Number</label>
                                    <input
                                        type="text" required
                                        value={formData.accountNumber}
                                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                                        placeholder="ACC-XXX-XXX"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Amount ($)</label>
                                    <input
                                        type="number" required step="0.01" min="0.01"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Reference (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.reference}
                                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 focus:bg-white transition-all outline-none text-slate-900 font-medium"
                                        placeholder="e.g. Test Credit"
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
                                        className="flex-3 px-8 py-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50">
                                        {isLoading ? 'Injecting...' : 'Inject Funds'}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6 animate-in slide-in-from-bottom-4">
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Funds Injected!</h3>
                            <p className="text-slate-500 text-sm mb-8">Liquidity has been successfully synchronized for account <span className="text-emerald-600 font-bold">{formData.accountNumber}</span>.</p>

                            <button
                                onClick={onClose}
                                className="w-full px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors">
                                Done
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FundInjectionModal;
