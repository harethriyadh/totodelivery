import { useState, useCallback } from 'react';

/**
 * useSwipeAction Hook
 * Tracks touch/mouse events to detect a horizontal swipe.
 * Triggers onComplete if threshold is reached.
 */
export const useSwipeAction = (threshold = 200, onComplete, direction = 'left') => {
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const handleStart = useCallback((e) => {
        setIsDragging(true);
        const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        setStartX(x);
    }, []);

    const handleMove = useCallback((e) => {
        if (!isDragging) return;
        const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;

        // RTL logic: swiping left means currentX < startX
        let delta = 0;
        if (direction === 'left') {
            delta = Math.max(0, startX - x);
        } else {
            delta = Math.max(0, x - startX);
        }

        if (delta > threshold) delta = threshold;
        setCurrentX(delta);
    }, [isDragging, startX, threshold, direction]);

    const handleEnd = useCallback(() => {
        if (!isDragging) return;
        if (currentX >= threshold - 10) {
            if (onComplete) onComplete();
        }
        setIsDragging(false);
        setCurrentX(0);
    }, [isDragging, currentX, threshold, onComplete]);

    return {
        currentX,
        isDragging,
        handlers: {
            onMouseDown: handleStart,
            onMouseMove: handleMove,
            onMouseUp: handleEnd,
            onTouchStart: handleStart,
            onTouchMove: handleMove,
            onTouchEnd: handleEnd
        }
    };
};
