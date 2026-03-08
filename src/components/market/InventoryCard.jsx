import React from 'react';
import { Power, Edit2, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

const InventoryCard = ({ item, onToggle, onEdit, onDelete }) => {
    // Data Convention: item.pricing.price (Fils)
    const displayPrice = item.pricing?.price || item.price;
    const unitLabel = item.inventory?.unit_type || item.unit || 'حبة';

    return (
        <div className={clsx("app-card p-4 relative group transition-all", !item.isAvailable && "opacity-70 grayscale")}>
            <div className="absolute top-3 right-3 z-10">
                <button
                    onClick={() => onToggle(item.id)}
                    className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm border",
                        item.isAvailable ? "bg-green-100 text-green-600 border-green-200" : "bg-neutral-100 text-neutral-400 border-neutral-200"
                    )}
                >
                    <Power className="w-4 h-4" />
                </button>
            </div>

            <div className="aspect-square bg-neutral-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                {(item.image_urls?.[0] || item.image) ? (
                    <img src={item.image_urls?.[0] || item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-4xl">📦</div>
                )}
            </div>

            <div className="text-right">
                <span className="text-[10px] text-primary-500 font-bold uppercase tracking-wider">
                    {item.category?.label_ar || item.category}
                </span>
                <h3 className="font-black text-neutral-900 text-base mb-1 truncate text-right">{item.name}</h3>
                <div className="flex items-baseline justify-end gap-1 mb-3">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase">د.ع / {unitLabel}</span>
                    <span className="text-lg font-black text-neutral-900">{displayPrice}</span>
                </div>
            </div>

            <div className="flex gap-2 mt-2 pt-3 border-t border-neutral-50">
                <button onClick={() => onEdit(item)} className="flex-1 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 py-2 rounded-lg text-xs font-black flex items-center justify-center gap-2 transition-colors">
                    <Edit2 className="w-3 h-3" />
                    تعديل
                </button>
                <button onClick={() => onDelete(item.id)} className="w-9 h-9 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};

export default InventoryCard;
