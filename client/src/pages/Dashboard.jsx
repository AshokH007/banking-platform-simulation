import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const { user, API_BASE } = useAuth();
    const [accountData, setAccountData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [balanceRes, historyRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/account/balance`),
                    axios.get(`${API_BASE}/api/transactions/history`)
                ]);
                setAccountData(balanceRes.data);
                setTransactions(historyRes.data);
            } catch (err) {
                console.error('Failed to fetch dashboard data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [API_BASE]);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Account Header */}
            <div className="mb-12">
                <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                    Primary Banking Account
                </h1>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-semibold text-slate-900 tracking-tight">
                            {user?.fullName}
                        </h2>
                        <p className="text-slate-500 mt-1 font-medium">
                            Customer ID: <span className="text-slate-900">{user?.customerId}</span>
                        </p>
                    </div>
                    <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 self-start md:self-auto">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Account Number
                        </p>
                        <p className="text-lg font-mono font-medium text-slate-900">
                            {accountData?.account_number}
                        </p>
                    </div>
                </div>
            </div>

            {/* Balance Card */}
            import TransactionList from '../components/TransactionList';

            // ... (inside component return)
            {/* Balance & Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Balance Card */}
                    <div className="bg-slate-900 rounded-[2rem] p-10 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform duration-700">
                            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.82v-1.91c-1.54-.13-3.03-.66-4.32-1.58l1.32-2.11c1.07.72 2.3 1.14 3.51 1.21.94.05 1.7-.19 2.06-.55.33-.33.39-.77.21-1.22-.3-.72-1.12-1.2-3.15-2.06-2.26-.96-3.76-2.03-4.14-3.87-.21-1.01-.06-2 .5-2.85.69-1.04 1.83-1.68 3.09-1.89V3h2.82v1.89c1.23.1 2.36.42 3.33.94l-1.14 2.1c-.81-.4-1.63-.61-2.45-.63-.94-.03-1.64.21-2.02.6-.28.29-.38.64-.28 1.07.13.51.59.95 2.1 1.6 2.37.99 3.86 2.01 4.3 3.93.18.79.16 1.74-.1 2.51-.57 1.61-1.92 2.72-3.88 2.98z" />
                            </svg>
                        </div>

                        <p className="text-slate-400 font-medium uppercase tracking-widest text-xs mb-4">
                            Available Balance
                        </p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl text-slate-400 font-light">$</span>
                            <span className="text-6xl font-bold tracking-tighter">
                                {parseFloat(accountData?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        <div className="mt-10 flex gap-4">
                            <button className="bg-white text-slate-900 hover:bg-slate-50 transition-colors px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-white/5">
                                Send Money
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 transition-colors px-6 py-3 rounded-xl text-sm font-semibold backdrop-blur-md">
                                Statements
                            </button>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-slate-900 font-bold text-xl tracking-tight">Recent Activity</h3>
                            <button className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">View All</button>
                        </div>
                        <TransactionList transactions={transactions} currentUserEmail={user?.email} />
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-slate-900 font-bold text-lg mb-6 tracking-tight">System Status</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <p className="text-sm text-slate-600 font-medium whitespace-nowrap">Ledger Synchronized</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <p className="text-sm text-slate-600 font-medium whitespace-nowrap">Session Security: High</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
