import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    MapPin,
    User,
    Phone,
    X,
    Save,
    LocateFixed,
} from 'lucide-react';
import TrackOrderMap from '../driver/TrackOrderMap';
import { isWithinServiceArea } from '../../utils/geofencing';
import { MAP_CONFIG } from '../../config/mapConfig';
import StatusModal from '../shared/StatusModal';

const EditProfileModal = ({ isOpen, onClose, initialData, onSave }) => {
    const [formData, setFormData] = useState(initialData);
    const [alertConfig, setAlertConfig] = useState({ open: false, title: '', message: '', type: 'error' });
    const [loadingGPS, setLoadingGPS] = useState(false);

    const mapContainerRef = useRef(null);

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

    const handleLocate = () => {
        if (!navigator.geolocation) {
            showAlert('خطأ', 'الجهاز لا يدعم تحديد الموقع', 'error');
            return;
        }

        setLoadingGPS(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const newPos = [pos.coords.latitude, pos.coords.longitude];
                handleLocationSelect(newPos);
                setLoadingGPS(false);
            },
            (err) => {
                setLoadingGPS(false);
                showAlert('فشل تحديد الموقع', 'يرجى التأكد من تفعيل صلاحيات الوصول للموقع في إعدادات المتصفح.', 'error');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
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

    return createPortal(
        <>
            <StatusModal
                isOpen={alertConfig.open}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={() => setAlertConfig(prev => ({ ...prev, open: false }))}
            />

            <div className="fixed inset-0 z-[10000] bg-neutral-900/60 backdrop-blur-[12px] flex items-center justify-center p-4 sm:p-6">
                <div className="bg-white w-full max-w-xl max-h-[90vh] rounded-[40px] shadow-[0_32px_80px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col animate-in zoom-in duration-300 relative z-[10001] border border-white/20">

                    {/* Header */}
                    <div className="px-6 py-5 border-b border-neutral-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-20">
                        <h2 className="text-xl font-black text-neutral-900 leading-tight">إعدادات الحساب</h2>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 hover:bg-neutral-100 transition-all hover:rotate-90 active:scale-90">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-5 py-8 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-end gap-2.5">
                                <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">تحديد موقع المتجر</span>
                                <div className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(73,160,109,0.5)]" />
                            </div>

                            <div
                                ref={mapContainerRef}
                                className="h-80 min-h-[40vh] w-full rounded-[24px] overflow-hidden border border-neutral-100 relative group bg-neutral-50 shadow-inner"
                                style={{ touchAction: 'none' }}
                            >
                                <div className="absolute top-4 inset-x-0 z-[50] flex justify-center px-12 pointer-events-none">
                                    <div className="bg-white/95 backdrop-blur-md border border-neutral-200/50 px-4 py-2 rounded-xl shadow-xl shadow-black/5">
                                        <span className="text-[10px] font-black text-neutral-800 whitespace-nowrap">
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
                                    showRecenter={false}
                                    showRoute={false}
                                    doubleClickZoom={false}
                                    defaultZoom={MAP_CONFIG.zoom.editProfile}
                                />
                            </div>

                            {/* GPS Action Button - Placed Under the Map */}
                            <button
                                onClick={handleLocate}
                                disabled={loadingGPS}
                                className="w-full py-4 bg-white border border-primary-100 rounded-2xl flex items-center justify-center gap-3 text-primary-600 font-black text-sm shadow-sm hover:bg-primary-50 active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                <LocateFixed className={loadingGPS ? "animate-spin" : ""} size={18} />
                                {loadingGPS ? 'جاري تحديد موقعك...' : 'استخدم موقعي الحالي (GPS)'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2 text-right">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mr-1">اسم صاحب المتجر</label>
                                <div className="relative group">
                                    <User className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
                                    <input
                                        type="text"
                                        value={formData.ownerName}
                                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                        className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl pr-14 pl-5 py-4 text-sm font-bold text-neutral-900 outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all text-right"
                                        dir="rtl"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mr-1">رقم الهاتف</label>
                                    <div className="relative group">
                                        <Phone className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
                                        <input
                                            type="tel"
                                            value={formData.phone1}
                                            onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                                            className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl pr-14 pl-5 py-4 text-sm font-bold text-neutral-900 outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all text-right"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 text-right">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mr-1">عنوان المتجر</label>
                                    <div className="relative group">
                                        <MapPin className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors w-5 h-5" />
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl pr-14 pl-5 py-4 text-sm font-bold text-neutral-900 outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all text-right"
                                            dir="rtl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-5 py-8 bg-white border-t border-neutral-100 flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleSave}
                            className="flex-[2] order-1 sm:order-2 py-5 rounded-[50px] bg-primary-500 text-white font-black text-lg flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(73,160,109,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            <Save size={20} />
                            حفظ التغييرات
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 order-2 sm:order-1 py-5 rounded-[50px] bg-neutral-100 text-neutral-500 font-bold text-sm active:scale-[0.98] transition-all"
                        >
                            إلغاء
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default EditProfileModal;
