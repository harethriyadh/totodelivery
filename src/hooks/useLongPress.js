import { useState, useCallback, useRef } from 'react';

/**
 * useLongPress Hook
 * Triggers a callback after a specified delay of holding down.
 */
export const useLongPress = (callback, delay = 1000) => {
    const [isPressing, setIsPressing] = useState(false);
    const timerRef = useRef(null);

    const start = useCallback(() => {
        setIsPressing(true);
        timerRef.current = setTimeout(() => {
            callback();
            setIsPressing(false);
        }, delay);
    }, [callback, delay]);

    const stop = useCallback(() => {
        setIsPressing(false);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    return {
        isPressing,
        handlers: {
            onMouseDown: start,
            onMouseUp: stop,
            onMouseLeave: stop,
            onTouchStart: start,
            onTouchEnd: stop
        }
    };
};
