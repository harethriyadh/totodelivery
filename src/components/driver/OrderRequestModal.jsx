import React from 'react';
import { Bell, MapPin, Navigation, Package, X } from 'lucide-react';

const OrderRequestModal = ({ order, onAccept, onDecline, timeLeft }) => {
    if (!order) return null;

    return (
        <div className="absolute inset-0 z-[60] bg-neutral-900/60 backdrop-blur-md flex items-center justify-center p-8">
            <div className="bg-white w-full max-w-sm rounded-[40px] overflow-hidden slide-up shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] text-center border border-white/20">
                <div className="bg-primary-50/50 py-10">
                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/10 border-2 border-primary-100 rotate-3">
                        <Package className="w-12 h-12 text-primary-500 pulsing-brand" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-3xl font-black text-neutral-900 px-6 leading-tight tracking-tighter">طلب جديد متاح!</h2>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <div className="h-6 px-3 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center shadow-lg shadow-red-500/20">
                            تنتهي خلال {timeLeft} ث
                        </div>
                    </div>
                </div>

                <div className="px-8 py-8 space-y-4">
                    <div className="bg-neutral-50 rounded-[28px] p-6 border border-neutral-100 flex flex-col gap-4 text-right shadow-inner">
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">المتجر</span>
                            <span className="text-base font-black text-neutral-900">{order.storeName}</span>
                        </div>
                        <div className="h-px bg-neutral-200/50"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">المكسب الصافي</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-primary-500">{order.earnings}</span>
                                <span className="text-[11px] font-black text-primary-600 uppercase">ر.س</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 pt-4">
                        <button
                            onClick={onAccept}
                            className="btn-primary w-full py-5 text-lg font-black"
                        >
                            قبول واستلام
                        </button>
                        <button
                            onClick={onDecline}
                            className="w-full py-4 text-neutral-400 hover:text-red-500 text-sm font-black tap-active transition-colors flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            تجاهل العرض
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderRequestModal;
