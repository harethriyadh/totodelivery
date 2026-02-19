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
    const [isBridgeReady, setIsBridgeReady] = useState(false);

    const isMedian = typeof window !== 'undefined' && (window.median || window.Median);

    /**
     * core: requestLocationSafely
     * Optimized for Median native wrapper to avoid 'Access Denied' web errors.
     */
    const requestLocationSafely = useCallback(async () => {
        const bridge = window.median || window.Median;

        if (bridge) {
            try {
                // 1. Check current native permission status
                const statusResult = await bridge.permissions.location({ request: false });

                if (statusResult.status === 'granted') {
                    setPermissionStatus('granted');
                    startTracking();
                    return true;
                }

                // 2. Request native authority if not already granted
                const requestResult = await bridge.permissions.location({
                    request: true,
                    status: 'fine'
                });

                if (requestResult.status === 'granted') {
                    setPermissionStatus('granted');
                    startTracking();
                    return true;
                } else {
                    setPermissionStatus('denied');
                    setError('NATIVE_PERMISSION_DENIED');
                    return false;
                }
            } catch (err) {
                console.error('Median Bridge Error:', err);
                return fallbackToWeb();
            }
        } else {
            return fallbackToWeb();
        }
    }, [options, watchId]);

    const fallbackToWeb = async () => {
        startTracking();
        return true;
    };

    const startTracking = useCallback(() => {
        if (!navigator.geolocation) {
            setError('GPS_NOT_SUPPORTED');
            return;
        }

        if (watchId) navigator.geolocation.clearWatch(watchId);

        const id = navigator.geolocation.watchPosition(
            (pos) => {
                setPosition({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    accuracy: pos.coords.accuracy,
                    timestamp: pos.timestamp
                });
                setError(null);
                setPermissionStatus('granted');
            },
            (err) => {
                setError(err.code === 1 ? 'PERMISSION_DENIED' : 'GPS_ERROR');
                if (err.code === 1) setPermissionStatus('denied');
            },
            options
        );
        setWatchId(id);
    }, [options, watchId]);

    useEffect(() => {
        // Lifecycle Sync: Hook into Median library ready event
        const handleLibraryReady = () => {
            setIsBridgeReady(true);
            // Auto-check on load to sync status
            const bridge = window.median || window.Median;
            bridge.permissions.location({ request: false }).then(res => {
                setPermissionStatus(res.status);
                if (res.status === 'granted') startTracking();
            });
        };

        if (window.median || window.Median) {
            handleLibraryReady();
        } else {
            window.addEventListener('median_library_ready', handleLibraryReady);
        }

        // iOS Optimization: Ready callback
        window.median_geolocation_ready = () => {
            requestLocationSafely();
        };

        return () => {
            window.removeEventListener('median_library_ready', handleLibraryReady);
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    return {
        position,
        error,
        permissionStatus,
        requestPermission: requestLocationSafely,
        isNativeApp: !!isMedian,
        isBridgeReady
    };
};
