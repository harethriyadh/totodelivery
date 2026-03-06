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
export const verifyCustomerCheckout = async (customerData) => {
    try {
        const deviceInfo = getDeviceInfo();

        const response = await fetch(`${API_BASE_URL}/auth/verify-checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone: customerData.phone,
                name: customerData.name,
                location: {
                    coordinates: [customerData.location[1], customerData.location[0]] // [longitude, latitude]
                },
                device_info: deviceInfo
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Save the confirmed session locally to prevent future prompts
            localStorage.setItem('customer_session', JSON.stringify({
                verified: true,
                phone: customerData.phone,
                timestamp: new Date().toISOString()
            }));

            // Remember last used coordinates
            if (customerData.location) {
                localStorage.setItem('last_known_location', JSON.stringify(customerData.location));
            }

            return { success: true, data };
        } else {
            return { success: false, message: data.message || 'فشل التحقق من الطلب' };
        }
    } catch (error) {
        console.error('Checkout Verification Error:', error);
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
