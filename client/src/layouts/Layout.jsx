import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">B</span>
                        </div>
                        <span className="font-semibold text-xl tracking-tight text-slate-900">BankSim</span>
                    </div>

                    {user && (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-slate-500 hidden sm:block">{user.full_name}</span>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            <footer className="border-t border-slate-200 bg-white mt-auto">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-center text-sm text-slate-400">
                    © {new Date().getFullYear()} BankSim Financial. Secure & Encrypted.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
