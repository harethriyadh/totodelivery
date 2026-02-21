
import React, { useState } from 'react';
import { Home, Package, ShoppingBag, User } from 'lucide-react';
import MarketBottomNav from '../../components/market/MarketBottomNav';
import MarketHome from './MarketHome';
import MarketOrders from './MarketOrders';
import MarketInventory from './MarketInventory';
import MarketProfile from './MarketProfile';

const MarketDashboard = () => {
    const [view, setView] = useState('home');

    return (
        <div className="bg-neutral-50 h-screen flex flex-col relative overflow-hidden">
            {/* Header - Simple for now */}
            <header className="px-6 py-5 bg-white flex justify-between items-center sticky top-0 z-30 border-b border-neutral-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-neutral-900 leading-tight">متجري</h1>
                        <p className="text-[10px] text-neutral-400 font-bold">لوحة التحكم</p>
                    </div>
                </div>
                {/* Busy Mode Toggle could go here but let's keep it in Home/Stats for now */}
            </header>

            <main className="flex-1 viewport-scroll w-full pb-24">
                {view === 'home' && <MarketHome />}
                {view === 'orders' && <MarketOrders />}
                {view === 'inventory' && <MarketInventory />}
                {view === 'profile' && <MarketProfile />}
            </main>

            <MarketBottomNav view={view} setView={setView} />
        </div>
    );
};

export default MarketDashboard;
