import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch, getDeviceInfo, API_BASE_URL } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isOnline, setIsOnline] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Restore session from localStorage
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('user_role');
        const storedUsername = localStorage.getItem('username');

        if (storedToken && storedRole) {
            setToken(storedToken);
            setUser({
                role: storedRole,
                username: storedUsername || ''
            });
            setIsOnline(localStorage.getItem('market_online') === 'true');
        }
        setLoading(false);
    }, []);

    const login = async (username, password, platform = 'MARKET_DASHBOARD') => {
        try {
            // Include device info for backend tracking
            const deviceInfo = getDeviceInfo();

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    password,
                    platform, // Platform Segregation Update
                    device_info: deviceInfo
                })
            });

            if (response.status === 403) {
                return {
                    success: false,
                    message: 'Unauthorized: Your account does not have access to this platform.'
                };
            }

            const data = await response.json();

            if (response.ok && data.success && data.token) {
                const userData = {
                    id: data.user?.id,
                    username: data.user?.username || username,
                    role: data.user?.role || data.role
                };

                setToken(data.token);
                setUser(userData);

                localStorage.setItem('token', data.token);
                localStorage.setItem('refresh_token', data.refresh_token || '');
                localStorage.setItem('user_role', userData.role);
                localStorage.setItem('username', userData.username);

                return { success: true };
            } else {
                return {
                    success: false,
                    message: data.message || 'فشل تسجيل الدخول: يرجى التحقق من البيانات'
                };
            }
        } catch (error) {
            console.error('Login Error:', error);
            return { success: false, message: 'خطأ في الاتصال بالخادم. تأكد من تشغيل الـ Backend' };
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                // Background logout request (don't wait for it to clear frontend state)
                apiFetch('/auth/logout', {
                    method: 'POST',
                    body: JSON.stringify({ refresh_token: refreshToken })
                }).catch(err => console.error('Logout error background:', err));
            }
        } finally {
            // Force frontend cleanup even if API fails
            setUser(null);
            setToken(null);
            setIsOnline(false);
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_role');
            localStorage.removeItem('username');
            localStorage.removeItem('market_online');
        }
    };

    const toggleOnline = async () => {
        // Here you would typically call an API to update status, then toggle UI
        const newState = !isOnline;
        setIsOnline(newState);
        localStorage.setItem('market_online', newState);
        return newState;
    };

    const value = {
        user,
        token,
        isOnline,
        toggleOnline,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
