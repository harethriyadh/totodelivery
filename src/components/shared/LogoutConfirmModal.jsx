import React from 'react';
import { createPortal } from 'react-dom';
import { LogOut, X } from 'lucide-react';

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[10000] bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-xs rounded-[32px] p-8 shadow-2xl animate-in zoom-in duration-200 text-center relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-neutral-50 rounded-full text-neutral-400 hover:bg-neutral-100 transition-colors"
                >
                    <X size={16} />
                </button>

                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <LogOut size={32} />
                </div>

                <h3 className="text-xl font-black text-neutral-900 mb-2">تسجيل الخروج</h3>
                <p className="text-sm text-neutral-500 font-bold mb-8 leading-relaxed">
                    هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onConfirm}
                        className="w-full py-4 rounded-2xl bg-red-500 text-white font-black text-sm hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                    >
                        نعم، سجل الخروج
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-4 rounded-2xl bg-neutral-50 text-neutral-600 font-black text-sm hover:bg-neutral-100 transition-all active:scale-95"
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LogoutConfirmModal;
