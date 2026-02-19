import { useState, useEffect } from 'react';

/**
 * useGeolocation Hook
 * Production-ready real-time tracking for the delivery partner.
 */
export const useGeolocation = (options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }) => {
    const [position, setPosition] = useState(null);
    const [error, setError] = useState(null);
    const [permissionStatus, setPermissionStatus] = useState('pending');

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('GPS_NOT_SUPPORTED');
            return;
        }

        // Check permission initial state
        navigator.permissions?.query({ name: 'geolocation' }).then(result => {
            setPermissionStatus(result.state);
            result.onchange = () => setPermissionStatus(result.state);
        });

        const handleSuccess = (pos) => {
            setPosition({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
                timestamp: pos.timestamp
            });
            setError(null);
        };

        const handleError = (err) => {
            switch (err.code) {
                case err.PERMISSION_DENIED:
                    setError('PERMISSION_DENIED');
                    break;
                case err.POSITION_UNAVAILABLE:
                    setError('POSITION_UNAVAILABLE');
                    break;
                case err.TIMEOUT:
                    setError('TIMEOUT');
                    break;
                default:
                    setError('UNKNOWN_ERROR');
            }
        };

        const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return { position, error, permissionStatus };
};
