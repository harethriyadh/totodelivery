import React, { useState, useEffect } from 'react';
import {
    LogOut,
    MapPin,
    Store,
    User,
    Phone,
    X,
    Save,
    Edit3,
    Navigation,
    LocateFixed,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import TrackOrderMap from '../../components/driver/TrackOrderMap';
import { useAuth } from '../../context/AuthContext';
import { SERVICE_AREA, isWithinServiceArea } from '../../utils/geofencing';

/**
 * Professional Status Modal
 * Replaces browser alerts with the design from your reference image
 */
const StatusModal = ({ isOpen, onClose, title, message, type = 'error', onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]" onClick={onClose} />

            <div className="relative w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${type === 'error' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                    }`}>
                    {type === 'error' ? <AlertCircle size={32} /> : <CheckCircle2 size={32} />}
                </div>

                <h3 className="text-xl font-black text-neutral-900 mb-2">{title}</h3>
                <p className="text-neutral-500 font-bold text-sm leading-relaxed mb-8">
                    {message}
                </p>

                <div className="flex gap-3 w-full">
                    <button
                        onClick={onConfirm || onClose}
                        className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg ${type === 'error'
                            ? 'bg-red-500 text-white shadow-red-500/20'
                            : 'bg-primary-500 text-white shadow-primary-500/20'
                            }`}
                    >
                        {type === 'error' ? 'موافق' : 'تم'}
                    </button>
                    {onConfirm && (
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl bg-neutral-100 text-neutral-500 font-bold text-sm active:scale-95"
                        >
                            إلغاء
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const EditProfileModal = ({ isOpen, onClose, initialData, onSave }) => {
    const [formData, setFormData] = useState(initialData);
    const [alertConfig, setAlertConfig] = useState({ open: false, title: '', message: '', type: 'error' });

    useEffect(() => {
        if (isOpen) setFormData(initialData);
    }, [isOpen, initialData]);

    const showAlert = (title, message, type = 'error') => {
        setAlertConfig({ open: true, title, message, type });
    };

    const handleLocationSelect = (newPos) => {
        if (isWithinServiceArea(newPos[0], newPos[1])) {
            setFormData(prev => ({ ...prev, storeLocation: newPos }));
        } else {
            showAlert('خارج النطاق', 'تنبيه: هذا الموقع خارج نطاق الخدمة المسموح به حالياً.', 'error');
        }
    };

    const handleSave = () => {
        if (!formData.ownerName?.trim()) {
            showAlert('خطأ في البيانات', 'يرجى إدخال اسم صاحب المتجر للمتابعة.', 'error');
            return;
        }
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <StatusModal
                isOpen={alertConfig.open}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={() => setAlertConfig(prev => ({ ...prev, open: false }))}
            />

            <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={onClose} />

                <div className="relative w-full max-w-xl bg-white rounded-t-[40px] sm:rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-500 max-h-[95vh] flex flex-col">

                    <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between bg-white z-20">
                        <h3 className="text-xl font-black text-neutral-900">إعدادات الحساب</h3>
                        <button onClick={onClose} className="w-11 h-11 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 active:scale-90 transition-transform">
                            <X size={22} />
                        </button>
                    </div>

                    <div className="p-8 overflow-y-auto space-y-8 flex-1">
                        {/* MAP UI SECTION */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-end gap-2">
                                <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">تحديد موقع المتجر</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                            </div>

                            <div className="h-64 rounded-[32px] overflow-hidden border border-neutral-100 relative group bg-neutral-50 shadow-inner">
                                {/* Fixed Label: Centered top to prevent Zoom Button overlap */}
                                <div className="absolute top-5 inset-x-0 z-[50] flex justify-center px-12 pointer-events-none">
                                    <div className="bg-white/95 backdrop-blur-md border border-neutral-200/50 px-5 py-2.5 rounded-2xl shadow-xl shadow-black/5">
                                        <span className="text-[11px] font-black text-neutral-800 whitespace-nowrap">
                                            اسحب الدبوس لتحديد الموقع بدقة
                                        </span>
                                    </div>
                                </div>

                                <TrackOrderMap
                                    pickupPos={formData.storeLocation}
                                    currentPos={formData.storeLocation}
                                    step="PICKUP"
                                    onMapClick={handleLocationSelect}
                                    navLabel={null}
                                />

                                {/* Improved Geolocation Button: Fixed click-through logic */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Stops interaction with the map behind the button
                                        if ("geolocation" in navigator) {
                                            navigator.geolocation.getCurrentPosition((pos) => {
                                                handleLocationSelect([pos.coords.latitude, pos.coords.longitude]);
                                            });
                                        }
                                    }}
                                    className="absolute bottom-5 right-5 z-[50] w-14 h-14 bg-white rounded-[20px] shadow-2xl flex items-center justify-center text-green-500 border border-green-50 active:scale-90 transition-all hover:bg-green-50"
                                >
                                    <LocateFixed size={28} />
                                </button>
                            </div>
                        </div>

                        {/* Input Fields */}
                        <div className="grid grid-cols-1 gap-5">
                            <div className="space-y-2 text-right">
                                <label className="text-[11px] font-black text-neutral-400 uppercase tracking-widest mr-1">اسم صاحب المتجر</label>
                                <div className="relative group">
                                    <User className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
                                    <input
                                        type="text"
                                        value={formData.ownerName}
                                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl pr-14 pl-5 py-4 text-sm font-bold text-neutral-900 outline-none focus:border-primary-500 focus:bg-white transition-all text-right"
                                        dir="rtl"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2 text-right">
                                    <label className="text-[11px] font-black text-neutral-400 uppercase tracking-widest mr-1">رقم الهاتف</label>
                                    <div className="relative group">
                                        <Phone className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
                                        <input
                                            type="tel"
                                            value={formData.phone1}
                                            onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                                            className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl pr-14 pl-5 py-4 text-sm font-bold text-neutral-900 outline-none focus:border-primary-500 focus:bg-white transition-all text-right"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 text-right">
                                    <label className="text-[11px] font-black text-neutral-400 uppercase tracking-widest mr-1">عنوان المتجر</label>
                                    <div className="relative group">
                                        <MapPin className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl pr-14 pl-5 py-4 text-sm font-bold text-neutral-900 outline-none focus:border-primary-500 focus:bg-white transition-all text-right"
                                            dir="rtl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Actions */}
                    <div className="p-8 border-t border-neutral-100 flex flex-col sm:flex-row gap-4 bg-white">
                        <button
                            onClick={handleSave}
                            className="flex-[2] order-1 sm:order-2 py-4.5 rounded-2xl bg-primary-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary-500/20 active:scale-[0.98] transition-all"
                        >
                            <Save size={18} />
                            حفظ التغييرات
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 order-2 sm:order-1 py-4.5 rounded-2xl bg-neutral-100 text-neutral-500 font-bold text-sm active:scale-[0.98] transition-all"
                        >
                            إلغاء
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

const MarketProfile = () => {
    const { logout } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userData, setUserData] = useState({
        ownerName: 'حارث الرياض',
        phone1: '07701234567',
        address: 'حي النعيم، شارع 45، بناية 12',
        storeLocation: [SERVICE_AREA.center.lat, SERVICE_AREA.center.lng]
    });

    return (
        <div className="flex flex-col h-full bg-[#fcfcfc] pb-24">
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={userData}
                onSave={(data) => setUserData(data)}
            />

            <div className="pt-16 pb-10 flex flex-col items-center relative px-6">
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute top-10 left-6 bg-white border border-neutral-100 px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-2 text-[11px] font-black text-primary-500 active:scale-95 transition-all"
                >
                    <Edit3 size={14} />
                    تعديل البيانات
                </button>

                <div className="w-32 h-32 bg-primary-500 rounded-[40px] p-1.5 shadow-2xl shadow-primary-500/20 rotate-3 group">
                    <div className="w-full h-full bg-white rounded-[35px] flex items-center justify-center -rotate-3 transition-transform group-hover:rotate-0">
                        <Store className="w-14 h-14 text-primary-500" />
                    </div>
                </div>

                <h3 className="text-2xl font-black text-neutral-900 mt-6 tracking-tight text-center">توتو ماركت</h3>
                <div className="flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">المتجر موثق</span>
                </div>
            </div>

            <div className="px-6 space-y-6">
                <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm divide-y divide-neutral-50 overflow-hidden">
                    <div className="p-5 flex items-center justify-between">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-neutral-400 uppercase">الاسم الكامل</p>
                            <p className="text-sm font-bold text-neutral-900 mt-0.5">{userData.ownerName}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400">
                            <User size={18} />
                        </div>
                    </div>
                    <div className="p-5 flex items-center justify-between">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-neutral-400 uppercase">رقم الهاتف</p>
                            <p className="text-sm font-bold text-neutral-900 mt-0.5">{userData.phone1}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400">
                            <Phone size={18} />
                        </div>
                    </div>
                    <div className="p-5 flex items-center justify-between">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-neutral-400 uppercase">الموقع الحالي</p>
                            <p className="text-sm font-bold text-neutral-900 mt-0.5">{userData.address}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400">
                            <MapPin size={18} />
                        </div>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full py-5 rounded-[24px] bg-red-50 text-red-500 font-black text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                    <LogOut size={18} className="rotate-180" />
                    تسجيل الخروج
                </button>
            </div>
        </div>
    );
};

export default MarketProfile;