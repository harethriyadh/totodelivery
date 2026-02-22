
import React, { useState } from 'react';
import StatusToggle from '../../components/driver/StatusToggle';
import MarketStatsCard from '../../components/market/MarketStatsCard';
import { Package, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MarketHome = () => {
    const { user, isOnline, toggleOnline } = useAuth();

    const topItems = [
        { id: 1, name: 'طماطم بلدي', sales: 45 },
        { id: 2, name: 'خيار طازج', sales: 32 },
        { id: 3, name: 'بطاطس', sales: 28 },
    ];

    return (
        <div className="px-6 py-6 slide-up">
            <div className="flex justify-between items-center mb-8">
                <StatusToggle isOnline={isOnline} onToggle={toggleOnline} />
                <div className="text-right">
                    <h3 className="text-sm font-black text-neutral-900 leading-none">
                        {user?.username === 'market' ? 'توتو ماركت' : (user?.username || 'متجري')}
                    </h3>
                    <p className="text-[10px] text-primary-500 font-bold uppercase mt-1">فرع النعيم</p>
                </div>
            </div>

            <MarketStatsCard amount="1,850.50" orders={24} />

            <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-white border border-neutral-100 p-4 rounded-2xl shadow-sm text-center">
                    <Clock className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">قيد الانتظار</p>
                    <p className="font-black text-xl text-neutral-900">3 طلبات</p>
                </div>
                <div className="bg-white border border-neutral-100 p-4 rounded-2xl shadow-sm text-center">
                    <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-2" />
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">الأكثر مبيعاً</p>
                    <p className="font-black text-xl text-neutral-900">طماطم</p>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-black text-neutral-900">الأكثر مبيعاً هذا الأسبوع</h3>
                </div>
                <div className="space-y-3">
                    {topItems.map((item) => (
                        <div key={item.id} className="bg-white p-3 rounded-xl border border-neutral-100 flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-xs">
                                    {item.id}
                                </div>
                                <span className="font-bold text-sm text-neutral-900">{item.name}</span>
                            </div>
                            <span className="text-xs font-black text-neutral-500">{item.sales} وحدة</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MarketHome;
