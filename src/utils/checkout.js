/**
 * Customer Checkout Utilities
 * Handles verified phone sessions and coordinate persistence.
 */
import { API_BASE_URL, getDeviceInfo } from './api';

/**
 * Checks if the customer has a verified session.
 */
export const checkCustomerSession = () => {
    const session = localStorage.getItem('customer_session');
    if (!session) return null;
    try {
        return JSON.parse(session);
    } catch (e) {
        return null;
    }
};

/**
 * Handles real /auth/verify-checkout request.
 */
/**
 * Customer Checkout - Technical Specifications V1.0
 */
export const verifyCustomerCheckout = async (customerData) => {
    try {
        const deviceInfo = getDeviceInfo();

        // Technical Spec: [long, lat]
        const coordinates = customerData.location?.coordinates || [0, 0];

        const payload = {
            phone: customerData.phone,
            name: customerData.name,
            location: { coordinates },
            device_info: { id: deviceInfo.id }
        };

        const response = await fetch(`${API_BASE_URL}/auth/verify-checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.success && data.token) {
            // Persist customer session
            localStorage.setItem('token', data.token);
            localStorage.setItem('user_role', 'customer');
            if (data.user?.id) localStorage.setItem('customer_id', data.user.id);

            // Success response
            return { success: true, user: data.user };
        } else {
            return {
                success: false,
                message: data.message || 'فشل التحقق من البيانات'
            };
        }
    } catch (error) {
        console.error('Checkout Auth Error:', error);
        return { success: false, message: 'خطأ في الاتصال بالخادم' };
    }
};

/**
 * Gets last known location for returning customers.
 */
export const getLastUsedLocation = () => {
    const saved = localStorage.getItem('last_known_location');
    return saved ? JSON.parse(saved) : null;
};
