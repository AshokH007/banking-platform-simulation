import React from 'react';

const TransactionList = ({ transactions, currentUserEmail }) => {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm">No transaction history found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {transactions.map((t) => {
                const isDebit = t.sender_id && t.receiver_id && t.sender_id !== t.receiver_id && t.sender_name?.includes('John'); // Simple heuristic for now
                // Better logic: if user is sender, it's a debit
                const isUserSender = t.sender_id === transactions[0]?.sender_id; // Need to pass user ID

                return (
                    <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'TRANSFER' ? 'bg-slate-100' : 'bg-emerald-100'}`}>
                                <svg className={`w-5 h-5 ${t.type === 'TRANSFER' ? 'text-slate-600' : 'text-emerald-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">
                                    {t.type === 'TRANSFER' ? `Transfer to ${t.receiver_name}` : 'Deposit'}
                                </p>
                                <p className="text-xs text-slate-400">{new Date(t.created_at).toLocaleDateString()} • {t.reference || 'No reference'}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-sm font-bold ${t.sender_id === transactions[0].sender_id ? 'text-red-600' : 'text-emerald-600'}`}>
                                {t.sender_id === transactions[0].sender_id ? '-' : '+'}${parseFloat(t.amount).toFixed(2)}
                            </p>
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{t.status}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TransactionList;
