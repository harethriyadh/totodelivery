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
    const [marketProfile, setMarketProfile] = useState(null);
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
                        const profile = data?.data || data;
                        const type = profile?.market_type || null;
                        if (profile) setMarketProfile(profile);
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
                    message: 'غير مصرح: حسابك لا يملك صلاحية الوصول لهذه المنصة.'
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
                    message: data.message || 'اسم المستخدم أو كلمة المرور غير صحيحة'
                };
            }
        } catch (error) {
            console.error('Login Error:', error);
            return { success: false, message: 'نواجه مشكلة في الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقاً.' };
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

    const fetchMarketProfile = async () => {
        try {
            const response = await apiFetch(`/profile/market?t=${Date.now()}`);
            if (response.ok) {
                const data = await response.json();
                const profile = data?.data || data;
                if (profile) {
                    setMarketProfile(profile);
                    if (profile.market_type) {
                        setMarketType(profile.market_type);
                        localStorage.setItem('market_type', profile.market_type);
                    }
                }
                return profile;
            }
        } catch (err) {
            console.error('Failed to fetch market profile', err);
        }
        return null;
    };

    // market_type is READ-ONLY per V4.3 spec — never PATCH it
    // Use PATCH /profile/market with market_name, branch_name, is_open, status, location only
    const updateMarketType = null; // intentionally removed — backend ignores this field if sent

    const value = {
        user,
        token,
        isOnline,
        marketType,
        marketProfile,
        toggleOnline,
        fetchMarketProfile,
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
