import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Initialize Auth State
    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    // Verify token by fetching profile
                    // This ensures the user state is populated on refresh
                    const { data } = await api.get('/account/profile');
                    // We can also decode the token client-side if we trust it, but verification is better
                    // We'll construct a user object from the profile response
                    setUser(data);
                } catch (error) {
                    console.error('Session restoration failed', error);
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
            return { success: true };
        } catch (error) {
            console.error('Login failed', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = async () => {
        try {
            if (token) await api.post('/auth/logout');
        } catch (err) {
            console.warn("Logout API call failed", err);
        } finally {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
