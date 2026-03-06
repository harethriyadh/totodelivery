/**
 * API Utility for TotoDelivery
 * Centralized fetch with token handling and refresh logic.
 */

export const API_BASE_URL = 'https://dof-b.onrender.com/api';

/**
 * Helper to get device info (Native or Web)
 */
export const getDeviceInfo = () => {
    // Check for Median bridge info
    const isMedian = typeof window !== 'undefined' && (window.median || window.Median);

    return {
        id: localStorage.getItem('device_id') || 'web-' + Math.random().toString(36).substr(2, 9),
        os: isMedian ? 'mobile' : 'web',
        model: navigator.userAgent.split(' ')[0] || 'Browser'
    };
};

/**
 * Standard Fetch with Bearer Auth
 */
export const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        let response = await fetch(url, { ...options, headers });

        // Handle 401: Token Expired - Attempt Refresh
        if (response.status === 401) {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken && endpoint !== '/auth/refresh-token') {
                const refreshed = await refreshAccessToken(refreshToken);
                if (refreshed) {
                    // Retry original request with NEW token
                    const newToken = localStorage.getItem('token');
                    headers['Authorization'] = `Bearer ${newToken}`;
                    response = await fetch(url, { ...options, headers });
                }
            }
        }

        return response;
    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
};

/**
 * Refresh Access Token Logic
 */
export const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken })
        });

        const data = await response.json();
        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            if (data.refresh_token) {
                localStorage.setItem('refresh_token', data.refresh_token);
            }
            return true;
        }
    } catch (e) {
        console.error('Token Refresh Loop Protection:', e);
    }

    // If refresh fails, we should probably force logout eventually,
    // but we'll let the application state handle that.
    return false;
};
