import React from 'react';
import { useAuth } from '../context/AuthContext';

const WorkerDashboard = () => {
    const { user } = useAuth();

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
                <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Session ID</p>
                    <p className="text-sm font-mono text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200">AUTH-PRD-OX92</p>
                </div>
            </header>

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
                        {['Audit Customer Table', 'System Status Audit', 'Freeze All Accounts', 'Generate Compliance Report'].map(tool => (
                            <button key={tool} className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all group">
                                {tool}
                                {tool === 'Freeze All Accounts' && <span className="ml-2 px-2 py-0.5 bg-red-500 text-[8px] rounded uppercase">Security</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerDashboard;
