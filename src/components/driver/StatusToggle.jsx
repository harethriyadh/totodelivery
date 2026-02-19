import React from 'react';
import { clsx } from 'clsx';

const StatusToggle = ({ isOnline, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className={clsx(
                "relative w-[130px] h-11 rounded-full border transition-all duration-300 flex items-center tap-active overflow-hidden",
                isOnline
                    ? "bg-[#E5F9E7] border-[#008F2D]"
                    : "bg-[#C4CDC4] border-[#B0BAB0]"
            )}
        >
            {/* The Knob */}
            <div
                className={clsx(
                    "absolute w-8 h-8 rounded-full shadow-md transition-all duration-500 ease-in-out z-10 mx-1.5",
                    isOnline
                        ? "translate-x-0 bg-[#008F2D]"
                        : "-translate-x-[75px] bg-[#4B6B52]"
                )}
            />

            {/* The Text */}
            <span
                className={clsx(
                    "w-full text-center text-[13px] font-black transition-all duration-300 z-0",
                    isOnline ? "pr-8 text-[#111827]" : "pl-8 text-[#111827]"
                )}
            >
                {isOnline ? 'متصل' : 'غير متصل'}
            </span>
        </button>
    );
};

export default StatusToggle;
