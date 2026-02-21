
import React from 'react';
import { Home, Package, ShoppingBag, User, List } from 'lucide-react';
import { clsx } from 'clsx';

const MarketBottomNav = ({ view, setView }) => {
    return (
        <nav className="h-20 bg-white border-t border-neutral-100 flex items-center sticky bottom-0 left-0 right-0 w-full z-50 shadow-[0_-15px_45px_rgba(0,0,0,0.08)]">
            <button
                onClick={() => setView('home')}
                className={clsx(
                    "flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-300",
                    view === 'home' ? "text-primary-600" : "text-neutral-400"
                )}
            >
                <Home className={clsx("w-6 h-6 transition-transform duration-300", view === 'home' && "scale-110")} />
                <span className={clsx("text-[10px] font-bold transition-all duration-300", view === 'home' ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1")}>الرئيسية</span>
            </button>
            <button
                onClick={() => setView('orders')}
                className={clsx(
                    "flex-1 flex flex-col items-center justify-center gap-1 relative transition-all duration-300",
                    view === 'orders' ? "text-primary-600" : "text-neutral-400"
                )}
            >
                <div className="relative">
                    <Package className={clsx("w-6 h-6 transition-transform duration-300", view === 'orders' && "scale-110")} />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white pulsing-brand"></div>
                </div>
                <span className={clsx("text-[10px] font-bold transition-all duration-300", view === 'orders' ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1")}>الطلبات</span>
            </button>
            <button
                onClick={() => setView('inventory')}
                className={clsx(
                    "flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-300",
                    view === 'inventory' ? "text-primary-600" : "text-neutral-400"
                )}
            >
                <List className={clsx("w-6 h-6 transition-transform duration-300", view === 'inventory' && "scale-110")} />
                <span className={clsx("text-[10px] font-bold transition-all duration-300", view === 'inventory' ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1")}>المخزون</span>
            </button>
            <button
                onClick={() => setView('profile')}
                className={clsx(
                    "flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-300",
                    view === 'profile' ? "text-primary-600" : "text-neutral-400"
                )}
            >
                <User className={clsx("w-6 h-6 transition-transform duration-300", view === 'profile' && "scale-110")} />
                <span className={clsx("text-[10px] font-bold transition-all duration-300", view === 'profile' ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1")}>ملفي</span>
            </button>
        </nav>
    );
};

export default MarketBottomNav;
