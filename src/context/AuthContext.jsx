import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isOnline, setIsOnline] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate checking for an existing session
        const storedUser = localStorage.getItem('user_role');
        if (storedUser) {
            setUser({
                role: storedUser,
                username: localStorage.getItem('username') || ''
            });
            setIsOnline(localStorage.getItem('market_online') === 'true');
        }
        setLoading(false);
    }, []);

    const login = (username, role) => {
        setUser({ username, role });
        localStorage.setItem('user_role', role);
        localStorage.setItem('username', username);
    };

    const logout = () => {
        setUser(null);
        setIsOnline(false);
        localStorage.removeItem('user_role');
        localStorage.removeItem('username');
        localStorage.removeItem('market_online');
    };

    const toggleOnline = () => {
        setIsOnline(prev => {
            const newState = !prev;
            localStorage.setItem('market_online', newState);
            return newState;
        });
    };

    const value = {
        user,
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
