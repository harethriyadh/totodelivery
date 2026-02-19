import { useState, useEffect, useCallback } from 'react';

/**
 * useGeolocation Hook
 * Production-ready real-time tracking with Median.co Native Bridge support.
 */
export const useGeolocation = (options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }) => {
    const [position, setPosition] = useState(null);
    const [error, setError] = useState(null);
    const [permissionStatus, setPermissionStatus] = useState('pending');
    const [watchId, setWatchId] = useState(null);

    // Median UI Bridge Helper
    const isMedian = typeof window !== 'undefined' && (window.median || window.Median);

    const startTracking = useCallback(async () => {
        // 1. Handle Native Permissions via Median Bridge if available
        if (isMedian) {
            try {
                const bridge = window.median || window.Median;
                // Request 'fine' location permission from the native OS
                const result = await bridge.permissions.location({
                    request: true,
                    status: 'fine'
                });

                if (result.status !== 'granted') {
                    setPermissionStatus('denied');
                    setError('NATIVE_PERMISSION_DENIED');
                    return;
                }
            } catch (err) {
                console.error('Median Bridge Error:', err);
            }
        }

        // 2. Standard Web Geolocation Logic
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

        // Clear existing watch if any
        if (watchId) navigator.geolocation.clearWatch(watchId);

        const id = navigator.geolocation.watchPosition(handleSuccess, handleError, options);
        setWatchId(id);
    }, [options, watchId, isMedian]);

    useEffect(() => {
        // Handle Median initialization callback if provided by the wrapper
        if (typeof window !== 'undefined') {
            window.median_geolocation_ready = () => {
                startTracking();
            };
        }

        // Initial permission check
        if (isMedian) {
            const bridge = window.median || window.Median;
            bridge.permissions.location({ request: false }).then(result => {
                setPermissionStatus(result.status);
                if (result.status === 'granted') {
                    startTracking();
                }
            });
        } else if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'geolocation' }).then(result => {
                setPermissionStatus(result.state);
                if (result.state === 'granted') {
                    startTracking();
                }
                result.onchange = () => {
                    setPermissionStatus(result.state);
                    if (result.state === 'granted') startTracking();
                };
            });
        } else {
            // Fallback for Safari/Older browsers
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
        requestPermission: startTracking,
        isNativeApp: !!isMedian
    };
};
