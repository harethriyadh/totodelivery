import React, { useState, useEffect, useMemo } from 'react';
import { Home, Compass, User, MapPin, Navigation, Navigation2, Search, Bell, Settings, ArrowLeft, Package } from 'lucide-react';
import { clsx } from 'clsx';
import StatusToggle from '../../components/driver/StatusToggle';
import EarningsCard from '../../components/driver/EarningsCard';
import OrderMetric from '../../components/driver/OrderMetric';
import OrderRequestModal from '../../components/driver/OrderRequestModal';
import ActiveDeliveryCard from '../../components/driver/ActiveDeliveryCard';
import DriverProfile from './DriverProfile';
import Notifications from './Notifications';
import TrackOrderMap from '../../components/driver/TrackOrderMap';
import { useGeolocation } from '../../hooks/useGeolocation';
import { calculateDistance } from '../../utils/mapUtils';

const DriverHome = () => {
    // State
    const [isOnline, setIsOnline] = useState(false);
    const [activeOrder, setActiveOrder] = useState(null);
    const [step, setStep] = useState('PICKUP'); // PICKUP or DELIVERY
    const [itemsChecked, setItemsChecked] = useState({});
    const [view, setView] = useState('home');
    const [availableOrders, setAvailableOrders] = useState([]);

    // 1. Real-Time Geolocation
    const { position, error: gpsError, permissionStatus, requestPermission, isNativeApp } = useGeolocation();

    // Mobile Detection
    const isMobile = useMemo(() => {
        return isNativeApp || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }, [isNativeApp]);

    // Current coordinates (lat, lng array)
    const currentCoords = useMemo(() => {
        return position ? [position.lat, position.lng] : [24.7136, 46.6753];
    }, [position]);

    // 2. Proximity Calculations (Geofencing)
    const distanceToTarget = useMemo(() => {
        if (!activeOrder || !position) return null;
        const target = step === 'PICKUP' ? activeOrder.pickupPos : activeOrder.deliveryPos;
        return calculateDistance(position.lat, position.lng, target[0], target[1]);
    }, [activeOrder, step, position]);

    const proximityLocked = useMemo(() => {
        if (!activeOrder) return true;
        if (distanceToTarget === null) return true;
        // 10-meter geofence
        return distanceToTarget > 10;
    }, [distanceToTarget, activeOrder]);

    // Available Orders Logic (near real location)
    useEffect(() => {
        if (isOnline && !activeOrder && availableOrders.length === 0) {
            const timer = setTimeout(() => {
                const getRandomOffset = () => (Math.random() - 0.5) * 0.02;
                setAvailableOrders([
                    {
                        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
                        storeName: 'توتو ماركت - النعيم',
                        customerName: 'سارة أحمد',
                        distance: 'موقع قريب',
                        earnings: '12.00',
                        itemsCount: 5,
                        pickupAddress: 'موقع المتجر القريب',
                        deliveryAddress: 'حي العميل المجاور',
                        pickupPos: [currentCoords[0] + getRandomOffset(), currentCoords[1] + getRandomOffset()],
                        deliveryPos: [currentCoords[0] + getRandomOffset(), currentCoords[1] + getRandomOffset()],
                        items: [
                            { id: 1, name: 'طماطم طازجة', quantity: 2, unit: 'كجم' },
                            { id: 2, name: 'خيار بلدي', quantity: 1, unit: 'كجم' }
                        ]
                    }
                ]);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isOnline, activeOrder, availableOrders.length, currentCoords]);

    const handleToggleOnline = () => {
        setIsOnline(prev => {
            const next = !prev;
            if (!next) setAvailableOrders([]);
            return next;
        });
    };

    const handleAcceptOrder = (order) => {
        setActiveOrder(order);
        setAvailableOrders(prev => prev.filter(o => o.id !== order.id));
        setView('active');
        setStep('PICKUP');
        setItemsChecked({});
    };

    const handleToggleItem = (id) => {
        if (step === 'PICKUP' && proximityLocked) return;
        setItemsChecked(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleActionComplete = () => {
        if (step === 'PICKUP') {
            setStep('DELIVERY');
        } else {
            setActiveOrder(null);
            setView('home');
            setAvailableOrders([]);
        }
    };

    // Auto-request location authority immediately when the app starts
    useEffect(() => {
        requestPermission();
    }, [requestPermission]);

    return (
        <div className="app-container">
            {/* Main Header */}
            {view !== 'notifications' && view !== 'active' && (
                <header className="px-6 py-5 bg-white flex justify-between items-center sticky top-0 z-30 border-b border-neutral-100">
                    <button
                        onClick={() => setView('notifications')}
                        className="w-11 h-11 flex items-center justify-center bg-neutral-50 rounded-full text-neutral-800 tap-active relative"
                    >
                        <Bell className="w-5 h-5" />
                        <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                    </button>

                    <div className="relative flex flex-col items-center">
                        <img src="/images/d-logo.svg" alt="توتو" className="h-10 w-auto" />
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-24">
                {view === 'home' && (
                    <div className="px-6 py-6 slide-up">
                        <div className="flex justify-between items-center mb-8">
                            <StatusToggle isOnline={isOnline} onToggle={handleToggleOnline} />
                            <div className="text-right">
                                <h3 className="text-sm font-black text-neutral-900 leading-none">كابتن أحمد</h3>
                                <p className="text-[10px] text-primary-500 font-bold uppercase mt-1">شريك بلاتيني</p>
                            </div>
                        </div>

                        <EarningsCard amount="128.40" trips={14} />

                        <div className="grid grid-cols-3 gap-3 mb-10">
                            <OrderMetric label="القبول" value="98%" />
                            <OrderMetric label="الموعد" value="100%" />
                            <OrderMetric label="الإلغاء" value="1%" />
                        </div>

                        {!isOnline ? (
                            <div className="mt-16 text-center">
                                <div className="w-28 h-28 bg-neutral-50 mx-auto rounded-full flex items-center justify-center mb-8 border border-neutral-100 shadow-sm">
                                    <MapPin className="w-12 h-12 text-neutral-200" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-black text-neutral-900 leading-tight">غير متصل حالياً</h3>
                                <p className="text-sm text-neutral-400 mt-2 px-12 leading-relaxed font-bold">قم بتفعيل الاتصال للبدء في تلقي طلبات التوصيل</p>
                            </div>
                        ) : activeOrder ? (
                            <div className="mt-10">
                                <div className="app-card p-6 border-primary-500/20 bg-primary-50/10">
                                    <div className="flex items-center gap-5 mb-8 text-right">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-neutral-100">
                                            <Navigation2 className="w-8 h-8 text-primary-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-neutral-900 leading-tight">لديك رحلة نشطة</h4>
                                            <p className="text-xs text-primary-500 font-bold mt-1">رقم الطلب: #{activeOrder.id}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setView('active')}
                                        className="btn-primary w-full py-5 text-base font-black flex items-center justify-center gap-3"
                                    >
                                        <Navigation className="w-6 h-6" strokeWidth={3} />
                                        الذهاب إلى الخريطة النشطة
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-black text-neutral-900">الطلبات المتاحة ({availableOrders.length})</h3>
                                    <button className="btn-secondary px-5 py-2 text-[11px] font-black border-none shadow-soft flex items-center gap-2">تحديث القائمة</button>
                                </div>
                                <div className="space-y-4">
                                    {availableOrders.map((order) => (
                                        <div key={order.id} className="app-card p-5 border border-neutral-100 hover:app-card-active transition-all text-right group active:scale-[0.98]">
                                            <div className="flex justify-between items-start mb-5">
                                                <span className="bg-primary-50 text-primary-600 text-[10px] font-black px-3 py-1.5 rounded-full border border-primary-500/10">متاح الآن</span>
                                                <span className="text-[10px] text-neutral-300 font-bold">رقم {order.id}</span>
                                            </div>
                                            <div className="flex gap-4 mb-6">
                                                <div className="w-16 h-16 img-placeholder shrink-0 flex items-center justify-center">
                                                    <Search className="w-6 h-6 text-neutral-200" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-black text-neutral-900 mb-1.5 text-base">{order.storeName}</h4>
                                                    <div className="text-[11px] text-neutral-400 font-bold">
                                                        <span>{order.pickupAddress}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-5 border-t border-neutral-50">
                                                <span className="text-2xl font-black text-neutral-900">{order.earnings} ر.س</span>
                                                <button onClick={() => handleAcceptOrder(order)} className="btn-primary px-8 py-4 text-sm font-black">حجز الطلب (Reserve)</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {view === 'active' && activeOrder && (
                    <div className="flex flex-col h-full bg-neutral-50 relative slide-up">
                        <header className="px-6 py-4 bg-white flex items-center gap-4 sticky top-0 z-30 border-b border-neutral-100 shadow-sm">
                            <button onClick={() => setView('home')} className="w-10 h-10 flex items-center justify-center bg-neutral-50 rounded-full text-neutral-800">
                                <ArrowLeft className="w-5 h-5 rtl-flip" />
                            </button>
                            <h2 className="text-lg font-black text-neutral-900">تفاصيل الرحلة</h2>
                        </header>

                        <div className="flex-1 bg-neutral-100 relative min-h-[350px] z-0">
                            <TrackOrderMap
                                pickupPos={activeOrder.pickupPos}
                                deliveryPos={activeOrder.deliveryPos}
                                currentPos={currentCoords}
                                step={step}
                                gpsError={gpsError}
                                gpsPermission={permissionStatus}
                            />
                        </div>

                        <ActiveDeliveryCard
                            order={activeOrder}
                            step={step}
                            itemsChecked={itemsChecked}
                            onToggleItem={handleToggleItem}
                            onActionComplete={handleActionComplete}
                            distanceToTarget={distanceToTarget}
                            proximityLocked={proximityLocked}
                        />
                    </div>
                )}

                {view === 'profile' && <div className="slide-up h-full"><DriverProfile onBack={() => setView('home')} /></div>}
                {view === 'notifications' && <Notifications onBack={() => setView('home')} />}
            </main>

            {/* Bottom Nav */}
            {view !== 'notifications' && (
                <nav className="h-20 bg-white border-t border-neutral-100 flex items-center sticky bottom-0 left-0 right-0 w-full z-50 shadow-[0_-15px_45px_rgba(0,0,0,0.08)]">
                    <button
                        onClick={() => setView('home')}
                        className={clsx(
                            "flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-300",
                            view === 'home' ? "text-primary-500" : "text-neutral-400"
                        )}
                    >
                        <Home className={clsx("w-6 h-6 transition-transform duration-300", view === 'home' && "scale-110")} />
                        <span className={clsx("text-[10px] font-bold transition-all duration-300", view === 'home' ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1")}>الرئيسية</span>
                    </button>

                    <button
                        onClick={() => activeOrder && setView('active')}
                        disabled={!activeOrder}
                        className={clsx(
                            "flex-1 flex flex-col items-center justify-center gap-1 relative transition-all duration-300",
                            view === 'active' ? "text-primary-500" : (activeOrder ? "text-neutral-600" : "text-neutral-300")
                        )}
                    >
                        <div className="relative">
                            <Compass className={clsx("w-6 h-6 transition-transform duration-300", view === 'active' && "scale-110")} />
                            {activeOrder && view !== 'active' && (
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white pulsing-brand"></div>
                            )}
                        </div>
                        <span className={clsx("text-[10px] font-bold transition-all duration-300", view === 'active' ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1")}>الرحلة</span>
                    </button>

                    <button
                        onClick={() => setView('profile')}
                        className={clsx(
                            "flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-300",
                            view === 'profile' ? "text-primary-500" : "text-neutral-400"
                        )}
                    >
                        <User className={clsx("w-6 h-6 transition-transform duration-300", view === 'profile' && "scale-110")} />
                        <span className={clsx("text-[10px] font-bold transition-all duration-300", view === 'profile' ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1")}>حسابي</span>
                    </button>
                </nav>
            )}
        </div>
    );
};

export default DriverHome;
