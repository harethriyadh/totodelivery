
import React from 'react';
import { clsx } from 'clsx';
import { Store } from 'lucide-react';

const MarketStatusToggle = ({ isOnline, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className={clsx(
                "relative flex items-center gap-3 px-5 py-2.5 rounded-2xl transition-all duration-500 shadow-md active:scale-95 group overflow-hidden",
                isOnline
                    ? "bg-green-500 text-white shadow-green-500/20"
                    : "bg-neutral-100 text-neutral-500 shadow-neutral-200"
            )}
        >
            {/* Background Glow Effect */}
            <div className={clsx(
                "absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-20 bg-white",
                isOnline ? "opacity-10" : "opacity-0"
            )} />

            <div className={clsx(
                "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500",
                isOnline ? "bg-white/20 rotate-0" : "bg-neutral-200 -rotate-12 group-hover:rotate-0"
            )}>
                <Store className="w-4 h-4" />
            </div>

            <div className="flex flex-col items-start">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-0.5 opacity-70">
                    حالة المتجر
                </span>
                <span className="text-sm font-black leading-none">
                    {isOnline ? 'مفتوح الآن' : 'مغلق حالياً'}
                </span>
            </div>

            {/* Status Indicator Dot */}
            <div className="relative ml-1">
                <div className={clsx(
                    "w-2.5 h-2.5 rounded-full",
                    isOnline ? "bg-white animate-pulse" : "bg-neutral-400"
                )} />
                {isOnline && (
                    <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-50" />
                )}
            </div>
        </button>
    );
};

export default MarketStatusToggle;
