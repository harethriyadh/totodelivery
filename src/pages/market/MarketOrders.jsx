
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import OrderCard from '../../components/market/OrderCard';
import { Store, AlertTriangle } from 'lucide-react';

const MarketOrders = () => {
    const { isOnline } = useAuth();
    const [orders, setOrders] = useState([
        {
            id: '1234',
            customerName: 'سارة أحمد',
            time: 'منذ 5 دقائق',
            status: 'pending',
            payment_method: 'cash',
            payment_status: 'unpaid',
            total: '45.00',
            items: [
                { id: 1, name: 'طماطم بلدي', quantity: 2, unavailable: false },
                { id: 2, name: 'بصل أحمر', quantity: 1, unavailable: false },
            ]
        },
        {
            id: '5678',
            customerName: 'فهد محمد',
            time: 'منذ 10 دقائق',
            status: 'pending',
            payment_method: 'wallet',
            payment_status: 'paid',
            total: '12.00',
            items: [
                { id: 3, name: 'ليمون', quantity: 3, unavailable: false }
            ]
        }
    ]);

    const handleMarkUnavailable = (orderId, itemId) => {
        setOrders(orders.map(order => {
            if (order.id === orderId) {
                const updatedItems = order.items.map(item =>
                    item.id === itemId ? { ...item, unavailable: true } : item
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
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default MarketOrders;
