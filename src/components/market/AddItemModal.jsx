
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Image, Plus, ChevronDown, Check } from 'lucide-react';
import { clsx } from 'clsx';

const AddItemModal = ({ isOpen, onClose, onSave, itemToEdit }) => {
    const fileInputRef = useRef(null);
    const unitDropdownRef = useRef(null);
    const [isUnitOpen, setIsUnitOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryDropdownRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'خضار',
        features: '',
        description: '',
        price: '',
        unit: 'كجم',
        image: null,
    });

    const units = ['كجم', 'حبة', 'علبة', 'كرتون'];
    const categories = ['خضار', 'فواكه', 'لحوم', 'مخبوزات'];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (unitDropdownRef.current && !unitDropdownRef.current.contains(event.target)) {
                setIsUnitOpen(false);
            }
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setIsCategoryOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setIsUnitOpen(false);
            setIsCategoryOpen(false);
        }
        if (itemToEdit) {
            setFormData(itemToEdit);
        } else {
            setFormData({
                name: '',
                category: 'خضار',
                features: '',
                description: '',
                price: '',
                unit: 'كجم',
                image: null,
            });
        }
    }, [itemToEdit, isOpen]);

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, id: itemToEdit ? itemToEdit.id : Date.now() });
        onClose();
    };

    const modalContent = (
        <div className="fixed inset-0 z-[10000] bg-neutral-900/40 backdrop-blur-[8px] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full sm:max-w-md h-[90vh] sm:h-auto rounded-t-[24px] sm:rounded-[24px] overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-slide-up relative z-[10001]">
                <div className="px-6 py-5 border-b border-neutral-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-20">
                    <h2 className="text-xl font-bold text-neutral-900">{itemToEdit ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 hover:bg-neutral-100 transition-all hover:rotate-90">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Hidden File Input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                    />

                    {/* Image Upload Placeholder */}
                    <div
                        onClick={triggerFileInput}
                        className="aspect-video bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center text-neutral-400 cursor-pointer hover:bg-neutral-100 transition-colors group overflow-hidden relative"
                    >
                        {formData.image ? (
                            <>
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs">
                                    تغيير الصورة
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <Image className="w-5 h-5 text-primary-500" />
                                </div>
                                <span className="text-xs font-bold">ارفع صورة المنتج</span>
                            </>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2 truncate">اسم المنتج</label>
                            <input
                                type="text"
                                className="w-full bg-[#f9f9f9] border border-neutral-100 rounded-xl px-4 py-4 text-sm font-bold text-neutral-900 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                placeholder="مثال: طماطم بلدي"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2 truncate">السعر</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        className="w-full bg-[#f9f9f9] border border-neutral-100 rounded-xl px-4 py-4 text-sm font-bold text-neutral-900 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 pl-12 transition-all outline-none"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 group-focus-within:text-primary-500 transition-colors">ر.س</span>
                                </div>
                            </div>
                            <div className="relative" ref={unitDropdownRef}>
                                <label className="block text-sm font-medium text-neutral-700 mb-2 truncate">الوحدة</label>
                                <button
                                    type="button"
                                    onClick={() => setIsUnitOpen(!isUnitOpen)}
                                    className={clsx(
                                        "w-full bg-[#f9f9f9] border rounded-xl px-4 py-4 text-sm font-bold text-neutral-900 transition-all duration-200 flex items-center justify-between",
                                        isUnitOpen ? "border-primary-500 ring-4 ring-primary-500/5 bg-white scale-[1.02]" : "border-neutral-100 hover:border-neutral-200"
                                    )}
                                >
                                    <span>{formData.unit}</span>
                                    <ChevronDown className={clsx("w-4 h-4 text-neutral-400 transition-transform duration-300", isUnitOpen && "rotate-180")} />
                                </button>

                                {isUnitOpen && (
                                    <div className="absolute top-full right-0 left-0 mt-2 bg-white border border-neutral-100 rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="max-h-48 overflow-y-auto py-1">
                                            {units.map((u) => (
                                                <div
                                                    key={u}
                                                    onClick={() => {
                                                        setFormData({ ...formData, unit: u });
                                                        setIsUnitOpen(false);
                                                    }}
                                                    className={clsx(
                                                        "px-4 py-3 text-sm font-medium transition-colors duration-200 flex items-center justify-between cursor-pointer text-right",
                                                        formData.unit === u ? "bg-primary-50 text-primary-600" : "text-neutral-700 hover:bg-neutral-50"
                                                    )}
                                                >
                                                    <span className="flex-1 text-right">{u}</span>
                                                    {formData.unit === u && (
                                                        <Check className="w-3.5 h-3.5 text-primary-500 shrink-0 mr-2" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="relative" ref={categoryDropdownRef}>
                            <label className="block text-sm font-medium text-neutral-700 mb-2 truncate">القسم</label>
                            <button
                                type="button"
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                className={clsx(
                                    "w-full bg-[#f9f9f9] border rounded-xl px-4 py-4 text-sm font-bold text-neutral-900 transition-all duration-200 flex items-center justify-between",
                                    isCategoryOpen ? "border-primary-500 ring-4 ring-primary-500/5 bg-white scale-[1.02]" : "border-neutral-100 hover:border-neutral-200"
                                )}
                            >
                                <span>{formData.category}</span>
                                <ChevronDown className={clsx("w-4 h-4 text-neutral-400 transition-transform duration-300", isCategoryOpen && "rotate-180")} />
                            </button>

                            {isCategoryOpen && (
                                <div className="absolute top-full right-0 left-0 mt-2 bg-white border border-neutral-100 rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="max-h-48 overflow-y-auto py-1">
                                        {categories.map((cat) => (
                                            <div
                                                key={cat}
                                                onClick={() => {
                                                    setFormData({ ...formData, category: cat });
                                                    setIsCategoryOpen(false);
                                                }}
                                                className={clsx(
                                                    "px-4 py-3 text-sm font-medium transition-colors duration-200 flex items-center justify-between cursor-pointer text-right",
                                                    formData.category === cat ? "bg-primary-50 text-primary-600" : "text-neutral-700 hover:bg-neutral-50"
                                                )}
                                            >
                                                <span className="flex-1 text-right">{cat}</span>
                                                {formData.category === cat && (
                                                    <Check className="w-3.5 h-3.5 text-primary-500 shrink-0 mr-2" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2 truncate">وصف المنتج</label>
                            <textarea
                                className="w-full bg-[#f9f9f9] border border-neutral-100 rounded-xl px-4 py-4 text-sm font-bold text-neutral-900 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 h-32 resize-none transition-all outline-none"
                                placeholder="وصف قصير للمنتج..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-white border-t border-neutral-50 sticky bottom-0 z-20">
                    <button
                        onClick={handleSubmit}
                        className="btn-primary w-full py-5 text-lg font-bold rounded-[50px] flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(73,160,109,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Save className="w-5 h-5" />
                        {itemToEdit ? 'حفظ التعديلات' : 'إضافة المنتج'}
                    </button>
                    {itemToEdit && (
                        <p className="text-center mt-4 text-xs font-medium text-neutral-400">
                            جاري تعديل بيانات المنتج المختار
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default AddItemModal;
