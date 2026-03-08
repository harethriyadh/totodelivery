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
    const [marketType, setMarketType] = useState(localStorage.getItem('market_type') || null);
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

            // Fetch fresh market profile to get market_type
            if (storedRole === 'market_owner') {
                fetch(`${API_BASE_URL}/profile/market`, {
                    headers: { 'Authorization': `Bearer ${storedToken}` }
                })
                    .then(r => r.ok ? r.json() : null)
                    .then(data => {
                        const type = data?.data?.market_type || data?.market_type || null;
                        if (type) {
                            setMarketType(type);
                            localStorage.setItem('market_type', type);
                        }
                    })
                    .catch(() => { });
            }
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
                    id: data.user?.id || data.user?._id, // Data Convention v4.3
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
            setMarketType(null);
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_role');
            localStorage.removeItem('username');
            localStorage.removeItem('market_online');
            localStorage.removeItem('market_type');
        }
    };

    const toggleOnline = async () => {
        const newState = !isOnline;
        try {
            const response = await apiFetch('/profile/market', {
                method: 'PATCH',
                body: JSON.stringify({
                    is_open: newState,
                    status: newState ? 'active' : 'inactive'
                })
            });
            if (response.ok) {
                setIsOnline(newState);
                localStorage.setItem('market_online', newState);
                return newState;
            } else {
                console.error("Failed to toggle online status on server");
                return isOnline;
            }
        } catch (err) {
            console.error("Network error toggling online status", err);
            return isOnline;
        }
    };

    const updateMarketType = async (type) => {
        try {
            const response = await apiFetch('/profile/market', {
                method: 'PATCH',
                body: JSON.stringify({ market_type: type })
            });
            if (response.ok) {
                setMarketType(type);
                localStorage.setItem('market_type', type);
                return true;
            }
        } catch (err) {
            console.error('Failed to update market type', err);
        }
        return false;
    };

    const value = {
        user,
        token,
        isOnline,
        marketType,
        toggleOnline,
        updateMarketType,
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
