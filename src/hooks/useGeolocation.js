import { useState, useEffect, useCallback } from 'react';

/**
 * useGeolocation Hook
 * Production-ready real-time tracking for the delivery partner.
 */
export const useGeolocation = (options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }) => {
    const [position, setPosition] = useState(null);
    const [error, setError] = useState(null);
    const [permissionStatus, setPermissionStatus] = useState('pending');
    const [watchId, setWatchId] = useState(null);

    const startTracking = useCallback(() => {
        if (!navigator.geolocation) {
            setError('GPS_NOT_SUPPORTED');
            return;
        }

        const handleSuccess = (pos) => {
            setPosition({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
                timestamp: pos.timestamp
            });
            setError(null);
            setPermissionStatus('granted');
        };

        const handleError = (err) => {
            switch (err.code) {
                case err.PERMISSION_DENIED:
                    setError('PERMISSION_DENIED');
                    setPermissionStatus('denied');
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

        const id = navigator.geolocation.watchPosition(handleSuccess, handleError, options);
        setWatchId(id);
    }, [options]);

    useEffect(() => {
        // Initial permission check if supported
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'geolocation' }).then(result => {
                setPermissionStatus(result.state);
                if (result.state === 'granted') {
                    startTracking();
                }
                result.onchange = () => {
                    setPermissionStatus(result.state);
                    if (result.state === 'granted') {
                        startTracking();
                    } else if (result.state === 'denied') {
                        // Handle revoked permission
                    }
                };
            });
        } else {
            // Fallback for browsers without permissions API - try to start
            startTracking();
        }

        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, []); // Run once on mount

    return { 
        position, 
        error, 
        permissionStatus, 
        requestPermission: startTracking 
    };
};
