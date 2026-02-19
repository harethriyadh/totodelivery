import React from 'react';
import { Package, Check, Image as ImageIcon } from 'lucide-react';
import { clsx } from 'clsx';

const OrderPickup = ({ items, itemsChecked, onToggleItem, proximityLocked }) => {
    const checkedCount = Object.values(itemsChecked).filter(Boolean).length;

    // Mapping of mock images based on item names
    const getItemImage = (name) => {
        if (name.includes('طماطم')) return "https://img.freepik.com/premium-photo/tomato-isolated-white-background_123473-167.jpg";
        if (name.includes('خيار')) return "https://img.freepik.com/free-photo/fresh-green-cucumber-isolated-white_1203-1286.jpg";
        if (name.includes('حليب')) return "https://img.freepik.com/free-photo/bottle-milk-isolated-white_1203-1574.jpg";
        if (name.includes('أفوكادو')) return "https://img.freepik.com/free-photo/avocado-isolated-white-background_1203-1694.jpg";
        if (name.includes('خبز')) return "https://img.freepik.com/free-photo/bread-isolated-white-background_1203-1763.jpg";
        if (name.includes('زبادي')) return "https://img.freepik.com/premium-photo/yogurt-plastic-cup-isolated-white_76239-158.jpg";
        // New official image mappings
        if (name.includes('فونديشن') || name.includes('Foundation')) return "/images/Liquid Foundation (Foundation).webp";
        if (name.includes('ايشادو') || name.includes('Palette')) return "/images/Professional Eyeshadow (Palette).webp";
        if (name.includes('روج') || name.includes('Lipstick')) return "/images/Velvet Matte Lipstick.jpg";
        if (name.includes('ماسكارا') || name.includes('Mascara')) return "/images/Volumizing Mascara..webp";
        return null;
    };

    return (
        <div className="mb-10 px-1">
            {/* Delivery Header */}
            <div className="flex justify-between items-end mb-6">
                <div className="text-right">
                    <h3 className="font-black text-neutral-900 text-xl tracking-tighter flex items-center gap-2">
                        <Package className="w-6 h-6 text-primary-500" />
                        فحص بنود الطلب
                    </h3>
                    <p className={clsx(
                        "text-[11px] font-bold mt-1 transition-colors",
                        proximityLocked ? "text-orange-500" : "text-neutral-400"
                    )}>
                        {proximityLocked ? 'عليك الوصول للمتجر أولاً لتتمكن من فحص البنود' : 'يرجى التأكد من استلام كافة البنود من المتجر'}
                    </p>
                </div>
                <div className="bg-primary-50 px-4 py-2 rounded-xl border border-primary-100 flex flex-col items-center shadow-sm">
                    <span className="text-[10px] font-black text-primary-600 uppercase tracking-tight">تم التأكيد</span>
                    <span className="text-[16px] font-black text-primary-700 leading-none">{checkedCount} / {items.length}</span>
                </div>
            </div>

            <div className="space-y-3">
                {items.map((item) => {
                    const isChecked = itemsChecked[item.id];
                    const itemImage = getItemImage(item.name);

                    return (
                        <div
                            key={item.id}
                            onClick={() => !proximityLocked && onToggleItem(item.id)}
                            className={clsx(
                                "flex items-stretch gap-4 p-[3px] rounded-[18px] border transition-all duration-400 relative overflow-hidden",
                                isChecked
                                    ? "border-[#008F2D] bg-[#E5F9E7] shadow-[0_8px_20px_rgba(0,143,45,0.15)]"
                                    : "border-neutral-100 bg-white shadow-card",
                                proximityLocked ? "opacity-60 cursor-not-allowed grayscale-[0.5]" : "cursor-pointer tap-active"
                            )}
                        >
                            {/* Verification Zone (FAR LEFT in RTL) */}
                            <div className="flex flex-col items-center justify-center gap-1.5 px-6 shrink-0 order-1">
                                <div className={clsx(
                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                                    isChecked ? "bg-[#008F2D] shadow-lg shadow-[#008F2D]/20 scale-105" : "bg-neutral-50 border border-neutral-100"
                                )}>
                                    {isChecked && <Check className="w-6 h-6 text-white" strokeWidth={4} />}
                                    {!isChecked && <div className="w-6 h-6 rounded-full border-2 border-neutral-200"></div>}
                                </div>
                                <p className={clsx(
                                    "text-[10px] font-black uppercase tracking-tight transition-all",
                                    isChecked ? "text-[#008F2D] opacity-100" : "text-neutral-300 opacity-60"
                                )}>
                                    {isChecked ? "مؤكد" : "فحص"}
                                </p>
                            </div>

                            {/* Details (CENTER) */}
                            <div className="flex-1 text-right flex flex-col justify-center py-2 order-2">
                                <h4 className={clsx(
                                    "text-[15px] font-black mb-1 transition-colors leading-tight",
                                    isChecked ? "text-[#0F172A]" : "text-neutral-900",
                                    proximityLocked && "text-neutral-400"
                                )}>
                                    {item.name}
                                </h4>
                                <div className="flex items-center justify-end">
                                    <span className={clsx(
                                        "text-[11px] font-bold px-2 py-0.5 rounded-lg border",
                                        isChecked
                                            ? "bg-white/40 border-[#008F2D]/20 text-[#008F2D]"
                                            : "bg-neutral-100 border-neutral-200 text-neutral-400"
                                    )}>
                                        الكمية: {item.quantity} {item.unit || "قطعة"}
                                    </span>
                                </div>
                            </div>

                            {/* Thumbnail (FAR RIGHT in RTL) */}
                            <div className={clsx(
                                "w-28 min-h-[96px] rounded-[14px] overflow-hidden flex items-center justify-center shrink-0 border transition-all duration-300 order-3",
                                isChecked ? "border-[#008F2D]/20 grayscale-[0.2]" : "border-neutral-50 bg-neutral-50"
                            )}>
                                {itemImage ? (
                                    <img src={itemImage} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="bg-neutral-100 w-full h-full flex items-center justify-center">
                                        <ImageIcon className="w-8 h-8 text-neutral-200" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderPickup;
