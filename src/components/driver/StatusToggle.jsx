import React, { useState } from 'react';
import { clsx } from 'clsx';
import { ChevronDown, Check } from 'lucide-react';

const StatusToggle = ({ status = 'offline', onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const states = [
        { id: 'available', label: 'متصل (متاح)', color: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
        { id: 'busy', label: 'مشغول', color: 'bg-orange-500', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
        { id: 'on_break', label: 'في استراحة', color: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
        { id: 'offline', label: 'غير متصل', color: 'bg-neutral-500', bg: 'bg-neutral-50', text: 'text-neutral-700', border: 'border-neutral-200' }
    ];

    const current = states.find(s => s.id === status) || states[3];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-300 shadow-sm active:scale-95",
                    current.bg, current.border
                )}
            >
                <div className={clsx("w-2.5 h-2.5 rounded-full animate-pulse", current.color)} />
                <span className={clsx("text-xs font-black", current.text)}>{current.label}</span>
                <ChevronDown className={clsx("w-4 h-4 transition-transform duration-300", current.text, isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-2xl shadow-2xl border border-neutral-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                        {states.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => {
                                    onStatusChange(s.id);
                                    setIsOpen(false);
                                }}
                                className={clsx(
                                    "w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors group",
                                    status === s.id ? "bg-neutral-50" : ""
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={clsx("w-2 h-2 rounded-full", s.color)} />
                                    <span className={clsx(
                                        "text-xs font-bold",
                                        status === s.id ? "text-neutral-900" : "text-neutral-500 group-hover:text-neutral-900"
                                    )}>
                                        {s.label}
                                    </span>
                                </div>
                                {status === s.id && <Check className="w-3 h-3 text-primary-500" strokeWidth={4} />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default StatusToggle;
