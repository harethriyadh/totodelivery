import React from 'react';
import { Phone, Navigation, Clock, Truck, CreditCard, ChevronDown, Store, MessageSquare, MapPin } from 'lucide-react';
import { clsx } from 'clsx';
import ActionSlider from './ActionSlider';
import OrderPickup from './OrderPickup';

const ActiveDeliveryCard = ({
    order,
    step,
    itemsChecked,
    onToggleItem,
    onActionComplete,
    distanceToTarget,
    proximityLocked
}) => {
    const isPickup = step === 'PICKUP';
    const checkedCount = Object.values(itemsChecked).filter(Boolean).length;
    const allChecked = checkedCount === order.items.length;

    // Formatting distance string
    const distanceString = distanceToTarget !== null
        ? (distanceToTarget < 1000
            ? `${Math.round(distanceToTarget)} م`
            : `${(distanceToTarget / 1000).toFixed(1)} كم`)
        : '--';

    return (
        <div className="bg-white rounded-t-[44px] border-t border-neutral-100 flex flex-col relative z-20 shadow-[0_-15px_50px_rgba(0,0,0,0.12)] max-h-[75vh]">
            {/* Handle Bar */}
            <div className="w-16 h-1.5 bg-neutral-200 rounded-pill mx-auto my-6 shrink-0 shadow-inner"></div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 pb-4 scroll-smooth">
                <div className="flex justify-between items-start mb-8 gap-5">
                    <div className="flex-1 text-right">
                        <div className="flex items-center gap-2 mb-3">
                            <span className={clsx(
                                "px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border shadow-sm",
                                isPickup ? "bg-orange-50 text-orange-600 border-orange-100" : "bg-emerald-50 text-emerald-600 border-emerald-200"
                            )}>
                                {isPickup ? 'قيد التوجه للمتجر (Pickup)' : 'بدء رحلة التوصيل (Delivery)'}
                            </span>
                        </div>
                        <h2 className="text-2xl font-black text-neutral-900 mb-1.5 leading-tight">{isPickup ? order.storeName : order.customerName}</h2>
                        <p className="text-sm text-neutral-400 font-bold leading-relaxed">{isPickup ? order.pickupAddress : order.deliveryAddress}</p>
                    </div>

                    <div className="w-18 h-18 img-placeholder rounded-3xl shrink-0 flex items-center justify-center p-2 shadow-inner border-none bg-neutral-50">
                        <Store className="w-10 h-10 text-neutral-200" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Distance & Proximity Indicator */}
                <div className="bg-neutral-50 px-6 py-5 rounded-[28px] border border-neutral-100 mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={clsx(
                            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-soft transition-colors",
                            proximityLocked ? "bg-white text-neutral-400" : "bg-emerald-500 text-white animate-pulse"
                        )}>
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">المسافة للهدف</p>
                            <p className={clsx(
                                "text-xl font-black leading-none mt-1",
                                proximityLocked ? "text-neutral-900" : "text-emerald-600"
                            )}>{distanceString}</p>
                        </div>
                    </div>
                    {proximityLocked && (
                        <div className="bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
                            <p className="text-[10px] font-black text-orange-600">اقترب للمتابعة</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-white p-4.5 rounded-[22px] border border-neutral-100 shadow-soft text-center">
                        <Clock className="w-5 h-5 mx-auto mb-2 text-primary-500" />
                        <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-tighter">الحالة الحالية</p>
                        <p className="text-[15px] font-black text-neutral-900">{isPickup ? 'قيد التوجه' : 'تحت التوصيل'}</p>
                    </div>
                    <div className="bg-white p-4.5 rounded-[22px] border border-neutral-100 shadow-soft text-center">
                        <CreditCard className="w-5 h-5 mx-auto mb-2 text-primary-500" />
                        <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-tighter">طريقة السداد</p>
                        <p className="text-[13px] font-black text-emerald-600">كاش عند التسليم</p>
                    </div>
                </div>

                {isPickup && (
                    <div className="mb-6">
                        <OrderPickup
                            items={order.items}
                            itemsChecked={itemsChecked}
                            onToggleItem={onToggleItem}
                            proximityLocked={proximityLocked}
                        />
                    </div>
                )}
            </div>

            {/* Fixed Footer for Action Button */}
            <div className="px-8 pt-6 pb-10 border-t border-neutral-50 bg-white shadow-[0_-15px_45px_rgba(0,0,0,0.08)]">
                <ActionSlider
                    label={
                        !allChecked && isPickup
                            ? "يرجى التحقق من الأصناف أولاً"
                            : (proximityLocked ? `اقترب من ${isPickup ? 'المتجر' : 'العميل'}` : (isPickup ? "اعتماد الأصناف وبدء التوصيل" : "إتمام عملية التوصيل النهائي"))
                    }
                    onComplete={onActionComplete}
                    color={isPickup ? '#49A06D' : '#006837'}
                    disabled={(isPickup && !allChecked) || proximityLocked}
                />
            </div>
        </div>
    );
};

export default ActiveDeliveryCard;
