import React from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

const VerificationStatusModal = ({ isOpen, onClose, isVerified }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[10000] bg-neutral-900/60 backdrop-blur-[12px] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl p-8 text-center animate-in zoom-in duration-300">
                <button onClick={onClose} className="absolute top-6 left-6 w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
                    <X size={20} />
                </button>

                <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 ${isVerified ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-500'}`}>
                    {isVerified ? <ShieldCheck size={40} /> : <Clock size={40} />}
                </div>

                <h3 className="text-xl font-black text-neutral-900 mb-2">
                    {isVerified ? 'حساب موثق' : 'قيد التدقيق'}
                </h3>
                <p className="text-sm text-neutral-500 font-bold mb-8 leading-relaxed">
                    {isVerified
                        ? 'تهانينا! حسابك موثق بالكامل ويمكنك البدء في تلقي الطلبات والرحلات دون قيود.'
                        : 'جاري مراجعة وثائقك من قبل فريق الإدارة. سيتم إخطارك فور تفعيل الحساب.'}
                </p>

                {isVerified && (
                    <div className="space-y-3 mb-8">
                        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
                            <span className="text-xs font-bold text-neutral-400">حالة الهوية</span>
                            <div className="flex items-center gap-2 text-green-600 font-black text-xs">
                                موثقة <CheckCircle2 size={14} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
                            <span className="text-xs font-bold text-neutral-400">وثائق المركبة</span>
                            <div className="flex items-center gap-2 text-green-600 font-black text-xs">
                                موثقة <CheckCircle2 size={14} />
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="w-full py-4 rounded-2xl bg-neutral-900 text-white font-black text-sm active:scale-95 transition-all"
                >
                    إغلاق
                </button>
            </div>
        </div>,
        document.body
    );
};

export default VerificationStatusModal;
