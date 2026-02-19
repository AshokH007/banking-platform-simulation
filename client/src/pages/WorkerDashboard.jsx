import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { clsx } from 'clsx';
import OnboardCustomerModal from '../components/OnboardCustomerModal';

const WorkerDashboard = () => {
    const { user, API_BASE } = useAuth();
    const [view, setView] = useState('metrics'); // metrics or users
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (view === 'users') {
            fetchCustomers();
        }
    }, [view]);

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/api/staff/users`);
            setCustomers(res.data || []);
        } catch (err) {
            console.error('Failed to fetch customers');
        } finally {
            setIsLoading(false);
        }
    };

    const stats = [
        { label: 'Active Users', value: '1,284', grow: '+12%' },
        { label: 'Pending Audits', value: '14', grow: '-2' },
        { label: 'System Health', value: 'Optimal', grow: '100%' },
        { label: 'Daily Transfers', value: '$2.4M', grow: '+5.4%' }
    ];

    const firstName = user?.fullName?.split(' ')[0] || 'Staff';

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 bg-indigo-50/30 min-h-screen">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-indigo-600 text-[10px] font-bold text-white rounded uppercase tracking-widest">Staff Portal</span>
                        <h2 className="text-indigo-900 text-sm font-medium">Control Center</h2>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                        Welcome back, {firstName}
                    </h1>
                </div>
                <div className="text-right flex flex-col items-end gap-3">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100">
                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => setView('metrics')}
                            className={clsx(
                                "px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                                view === 'metrics' ? "bg-white text-indigo-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                            )}>
                            Metrics
                        </button>
                        <button
                            onClick={() => setView('users')}
                            className={clsx(
                                "px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                                view === 'users' ? "bg-white text-indigo-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                            )}>
                            User management
                        </button>
                    </div>
                </div>
            </header>

            {view === 'metrics' ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm shadow-indigo-100/20">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{stat.label}</p>
                                <div className="flex items-baseline justify-between">
                                    <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{stat.grow}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity Logs</h3>
                            <div className="space-y-4">
                                {[
                                    { user: 'John Doe', action: 'Login Success', time: '2m ago' },
                                    { user: 'System', action: 'Daily Backup Complete', time: '1h ago' },
                                    { user: 'Jane Smith', action: 'Transfer $500.00', time: '3h ago' }
                                ].map((log, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{log.user}</p>
                                            <p className="text-xs text-slate-500">{log.action}</p>
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-400">{log.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-indigo-900/20">
                            <h3 className="text-lg font-bold mb-6">Internal Tools</h3>
                            <div className="space-y-3">
                                {['System Health Monitor', 'Compliance Audit', 'Account Freezing Tool', 'Database Snapshot'].map(tool => (
                                    <button key={tool} className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all">
                                        {tool}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h3 className="text-slate-900 font-bold text-xl">Customer Directory</h3>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Manage bank identities</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95">
                            + Onboard Customer
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                                    <th className="px-8 py-4">Customer</th>
                                    <th className="px-8 py-4">Account ID</th>
                                    <th className="px-8 py-4">Balance</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {customers.map(c => (
                                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-bold text-slate-900">{c.full_name}</p>
                                            <p className="text-xs text-slate-400">{c.email}</p>
                                        </td>
                                        <td className="px-8 py-5 font-mono text-xs text-slate-600">
                                            {c.account_number}
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-bold text-slate-900">${parseFloat(c.balance).toLocaleString()}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Active</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <button className="text-indigo-600 hover:text-indigo-800 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Manage</button>
                                        </td>
                                    </tr>
                                ))}
                                {customers.length === 0 && !isLoading && (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-12 text-center text-slate-400 text-sm">No customers onboarded yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <OnboardCustomerModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={fetchCustomers}
                API_BASE={API_BASE}
            />
        </div>
    );
};

export default WorkerDashboard;
