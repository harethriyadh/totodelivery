
import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, MessageCircle, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import ChatOverlay from './ChatOverlay';

const OrderCard = ({ order, onMarkUnavailable }) => {
    const [status, setStatus] = useState('pending'); // pending, preparing, ready
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        let timer;
        if (status === 'preparing' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [status, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleAccept = () => {
        setStatus('preparing');
    };

    const handleReady = () => {
        setStatus('ready');
    };

    return (
        <div className="app-card border border-neutral-100 p-5 mb-4 group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <span className="bg-neutral-100 text-neutral-600 text-[10px] font-black px-2 py-1 rounded-md">#{order.id}</span>
                <span className="text-[10px] font-bold text-neutral-400">{order.time}</span>
            </div>

            <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 shadow-sm border border-primary-100">
                    <Package className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-center w-full">
                        <h4 className="font-black text-neutral-900 text-sm">{order.customerName}</h4>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-neutral-50 rounded-lg border border-neutral-100">
                            <span className="text-[9px] font-black text-neutral-400 capitalize">
                                {order.payment_method === 'cash' ? 'نقداً (Cash)' : 'محفظة (Wallet)'}
                            </span>
                        </div>
                    </div>
                    <p className="text-[11px] text-neutral-500 font-bold mt-0.5">{order.items.length} منتجات • {order.total} د.ع</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={clsx(
                            "text-[9px] font-black px-2 py-0.5 rounded-full border",
                            order.payment_status === 'paid'
                                ? "text-green-600 bg-green-50 border-green-100"
                                : "text-orange-600 bg-orange-50 border-orange-100"
                        )}>
                            {order.payment_status === 'paid' ? 'مدفوع (Paid)' : 'بانتظار الدفع (Unpaid)'}
                        </span>
                        {order.cancellation_reason && (
                            <span className="text-[9px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">سبب الإلغاء: {order.cancellation_reason}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Items List - Only show availability actions in Preparing mode */}
            <div className="bg-neutral-50 rounded-xl p-3 mb-4 space-y-2">
                {order.items.map((item) => (
                    <div key={item.id} className={clsx("flex justify-between items-center text-xs font-bold", item.unavailable && "opacity-50 line-through")}>
                        <span className="text-neutral-700">{item.name} x{item.quantity}</span>
                        {status === 'preparing' && !item.unavailable && (
                            <button
                                onClick={() => onMarkUnavailable(order.id, item.id)}
                                className="text-[9px] text-red-500 border border-red-100 bg-white px-2 py-0.5 rounded-md hover:bg-red-50"
                            >
                                غير متاح
                            </button>
                        )}
                        {item.unavailable && <span className="text-[9px] text-red-500">غير متوفر</span>}
                    </div>
                ))}
            </div>

            {status === 'pending' && (
                <button onClick={handleAccept} className="btn-primary w-full py-3 text-sm font-black flex justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    قبول الطلب
                </button>
            )}

            {status === 'preparing' && (
                <div className="space-y-3">
                    <div className="bg-orange-50 text-orange-600 border border-orange-100 rounded-xl p-3 flex justify-between items-center">
                        <span className="text-xs font-black flex items-center gap-2">
                            <Clock className="w-4 h-4 animate-pulse" />
                            جاري التجهيز...
                        </span>
                        <span className="text-xl font-black font-mono">{formatTime(timeLeft)}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        <button
                            onClick={() => setIsChatOpen(true)}
                            className="col-span-1 bg-neutral-100 text-neutral-600 rounded-xl flex items-center justify-center hover:bg-neutral-200 transition-colors"
                            title="محادثة السائق"
                        >
                            <MessageCircle className="w-5 h-5" />
                        </button>
                        <button onClick={handleReady} className="col-span-3 btn-primary py-3 text-sm font-black bg-green-500 hover:bg-green-600 border-none">
                            جاهز للتسليم
                        </button>
                    </div>
                </div>
            )}

            {status === 'ready' && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                    <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                    <h4 className="text-lg font-black text-green-700">جاهز للتسليم!</h4>
                    <p className="text-[10px] text-green-600 font-bold mb-3">أظهر هذا الرمز للسائق</p>
                    <div className="bg-white p-2 rounded-lg border border-dashed border-green-200 inline-block">
                        <span className="text-2xl font-black font-mono tracking-widest text-neutral-900">#{order.id}</span>
                    </div>
                </div>
            )}

            <ChatOverlay
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                driverName="السائق محمد"
            />
        </div>
    );
};

export default OrderCard;
