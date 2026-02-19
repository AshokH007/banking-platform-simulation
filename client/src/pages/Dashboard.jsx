import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
    const { user } = useAuth();
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const { data } = await api.get('/account/balance');
                setBalance(data.balance);
            } catch (error) {
                console.error('Failed to fetch balance', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBalance();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Balance Card */}
                <div className="md:col-span-2 card bg-slate-900 text-white border-transparent">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Balance</p>
                            <h2 className="text-4xl font-bold mt-2">
                                {loading ? (
                                    <div className="h-10 w-48 bg-slate-800 rounded animate-pulse"></div>
                                ) : (
                                    formatCurrency(balance)
                                )}
                            </h2>
                        </div>
                        <div className="bg-slate-800 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-slate-400 text-xs">Account Number</p>
                            <p className="font-mono text-slate-200 mt-1 tracking-wider">
                                {user?.account_number || '•••• •••• ••••'}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="inline-block bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full font-medium border border-green-500/20">
                                Active Status
                            </span>
                        </div>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6">Profile Details</h3>

                    <div className="space-y-4">
                        <div>
                            <p className="text-slate-500 text-xs uppercase font-semibold">Full Name</p>
                            <p className="text-slate-900 font-medium">{user?.full_name}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs uppercase font-semibold">Customer ID</p>
                            <p className="text-slate-900 font-medium">{user?.customer_id}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs uppercase font-semibold">Email</p>
                            <p className="text-slate-900 font-medium">{user?.email}</p>
                        </div>
                        <div className="pt-4 border-t border-slate-100 mt-4">
                            <p className="text-slate-400 text-xs">Member since {formatDate(user?.created_at)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="card">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Activity</h3>
                <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    <p>No recent transactions to display.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
