import React, { useState, useRef, useEffect } from 'react';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

const ActionSlider = ({ label, onComplete, color = '#49A06D', disabled }) => {
    const [sliderX, setSliderX] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const containerRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);

    const handleStart = (e) => {
        if (disabled || isComplete) return;
        isDragging.current = true;
        startX.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    };

    const handleMove = (e) => {
        if (!isDragging.current || disabled || isComplete) return;
        const currentClientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;

        // In RTL (Right to Left): 
        // We start on the right. Moving left means currentClientX < startX.
        // deltaX = startX - currentClientX (this will be positive as we move left)
        const deltaX = startX.current - currentClientX;
        const maxSlide = containerRef.current.offsetWidth - 72; // Handle width (56) + margins (8+8)

        if (deltaX >= 0 && deltaX <= maxSlide) {
            setSliderX(deltaX);
        }
    };

    const handleEnd = () => {
        if (!isDragging.current || disabled || isComplete) return;
        isDragging.current = false;
        const maxSlide = containerRef.current.offsetWidth - 72;

        if (sliderX > maxSlide * 0.85) {
            setSliderX(maxSlide);
            setIsComplete(true);
            onComplete();
        } else {
            setSliderX(0);
        }
    };

    useEffect(() => {
        if (isComplete) {
            const timer = setTimeout(() => {
                setIsComplete(false);
                setSliderX(0);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isComplete]);

    return (
        <div
            ref={containerRef}
            className={clsx(
                "relative w-full h-[72px] bg-neutral-100 rounded-[24px] overflow-hidden touch-none transition-all border border-neutral-200 p-2",
                disabled ? "opacity-40 grayscale" : "opacity-100 shadow-inner"
            )}
            style={{ direction: 'rtl' }}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
        >
            {/* Background "Fill" - Grows from Right to Left in RTL */}
            <div
                className="absolute right-2 top-2 bottom-2 rounded-[18px] transition-all opacity-10 pointer-events-none"
                style={{ width: `${sliderX + 56}px`, backgroundColor: color }}
            />

            {/* Label - Centered but accounting for handle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 px-12" style={{ opacity: 1 - sliderX / 150 }}>
                <span className="text-[14px] font-black text-gray-400 tracking-tight select-none">
                    {isComplete ? 'تم بنجاح' : label}
                </span>
            </div>

            {/* Handle - Positioned on the RIGHT initially */}
            <div
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                className="absolute right-2 top-2 bottom-2 z-10 w-[56px] h-[56px] rounded-[18px] flex items-center justify-center shadow-xl transition-all cursor-grab active:cursor-grabbing border border-white/20 active:scale-95"
                style={{
                    transform: `translateX(-${sliderX}px)`,
                    background: isComplete
                        ? 'linear-gradient(135deg, #49A06D 0%, #3d865c 100%)'
                        : `linear-gradient(135deg, ${color} 0%, ${color}DD 100%)`,
                    boxShadow: `0 8px 16px -4px ${isComplete ? '#49A06D66' : color + '66'}`
                }}
            >
                {isComplete ? (
                    <Check className="w-8 h-8 text-white" strokeWidth={5} />
                ) : (
                    <ArrowLeft className="w-8 h-8 text-white" strokeWidth={5} />
                )}
            </div>
        </div>
    );
};

export default ActionSlider;
