import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Professional Status Modal
 */
const StatusModal = ({ isOpen, onClose, title, message, type = 'error', onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]" onClick={onClose} />
            <div className="relative w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${type === 'error' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                    {type === 'error' ? <AlertCircle size={32} /> : <CheckCircle size={32} />}
                </div>
                <h3 className="text-xl font-black text-neutral-900 mb-2">{title}</h3>
                <p className="text-neutral-500 font-bold text-sm leading-relaxed mb-8">{message}</p>
                <div className="flex gap-3 w-full">
                    <button
                        onClick={onConfirm || onClose}
                        className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg ${type === 'error' ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-primary-500 text-white shadow-primary-500/20'}`}
                    >
                        {type === 'error' ? 'موافق' : 'تم'}
                    </button>
                    {onConfirm && (
                        <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-neutral-100 text-neutral-500 font-bold text-sm active:scale-95">
                            إلغاء
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatusModal;
