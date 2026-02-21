
import React, { useState } from 'react';
import OrderCard from '../../components/market/OrderCard';

const MarketOrders = () => {
    const [orders, setOrders] = useState([
        {
            id: '1234',
            customerName: 'سارة أحمد',
            time: 'منذ 5 دقائق',
            status: 'pending',
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

    return (
        <div className="px-6 py-6 slide-up pb-24">
            <h2 className="text-xl font-black text-neutral-900 mb-6">الطلبات النشطة</h2>

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
