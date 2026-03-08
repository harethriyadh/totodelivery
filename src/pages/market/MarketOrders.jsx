import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../utils/api';
import OrderCard from '../../components/market/OrderCard';
import { Store, AlertTriangle, XCircle } from 'lucide-react';
import { OrderCardSkeleton } from '../../components/shared/Skeletons';

const MarketOrders = () => {
    const { isOnline } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionError, setActionError] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiFetch('/orders/active');
            const data = await response.json();
            if (response.ok) {
                // Ensure data convention mapping handles { data: [...] } format
                const orderArray = data.data || data.orders || (Array.isArray(data) ? data : []);
                const processed = orderArray.map(o => ({
                    ...o,
                    id: o._id || o.id,
                    short_id: o.short_id || `TOTO-${(o.id || o._id)?.toString().slice(-4)}`
                }));
                setOrders(processed);
            } else {
                setError(data.message || 'فشل تحميل الطلبات');
            }
        } catch (err) {
            setError('خطأ في الاتصال بالخادم');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOnline) {
            fetchOrders();
            // Periodic polling every 30s
            const interval = setInterval(fetchOrders, 30000);
            return () => clearInterval(interval);
        }
    }, [isOnline]);

    const updateOrderStatus = async (orderId, newStatus) => {
        setActionError(null);
        try {
            // Technical Spec: PATCH /orders/:id/status
            const response = await apiFetch(`/orders/${orderId}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Update local state for immediate feedback
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            } else {
                const data = await response.json();
                setActionError(data.message || 'فشل الجي بي أي: حالة الطلب');
                setTimeout(() => setActionError(null), 5000);
            }
        } catch (err) {
            console.error('Status update error:', err);
            setActionError('خطأ في الاتصال بالشبكة للمزامنة');
            setTimeout(() => setActionError(null), 5000);
        }
    };

    const handleMarkUnavailable = (orderId, itemId) => {
        // Technically this should be an API call to mark product as unavailable in order
        // For now, let's keep the local update as per existing UI logic
        setOrders(orders.map(order => {
            if (order.id === orderId) {
                const updatedItems = order.items.map(item =>
                    item.id === itemId || item.product_id === itemId ? { ...item, unavailable: true } : item
                );
                return { ...order, items: updatedItems };
            }
            return order;
        }));
    };

    if (!isOnline) {
        return (
            <div className="px-6 py-12 slide-up flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-neutral-100 rounded-3xl flex items-center justify-center text-neutral-400 mb-6 border border-neutral-200 shadow-inner">
                    <Store className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-black text-neutral-800 mb-2">المتجر مغلق حالياً</h2>
                <p className="text-sm text-neutral-500 font-bold max-w-[240px] leading-relaxed">
                    لن تتمكن من استقبال أي طلبات جديدة حتى تقوم بتغيير حالة المتجر إلى <span className="text-green-600 font-black">"مفتوح"</span> من الصفحة الرئيسية.
                </p>
                <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-3 text-right">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <p className="text-[11px] text-orange-700 font-black leading-tight">
                        ملاحظة: في حالة كون المتجر غير متاح، لن يتمكن الزبائن من رؤية المنتجات التي يعرضها المتجر.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-6 py-6 slide-up pb-24">
            <h2 className="text-xl font-black text-neutral-900 mb-6 text-right">الطلبات النشطة</h2>

            {actionError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-row-reverse items-start justify-between text-right animate-in fade-in slide-in-from-top-2 shadow-sm">
                    <div className="flex flex-row-reverse items-start gap-3 flex-1">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-700 font-bold leading-relaxed">{actionError}</p>
                    </div>
                    <button onClick={() => setActionError(null)} className="text-red-400 hover:text-red-600 transition-colors ml-2">
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>
            )}

            {loading && orders.length === 0 ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((sk) => (
                        <OrderCardSkeleton key={sk} />
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-10 bg-red-50 rounded-2xl border border-red-100 p-6">
                    <p className="text-red-700 font-bold text-sm">{error}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className="text-center py-10 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                            <p className="text-neutral-400 font-bold">لا توجد طلبات نشطة حالياً</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onMarkUnavailable={handleMarkUnavailable}
                                onUpdateStatus={(status) => updateOrderStatus(order.id, status)}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default MarketOrders;
