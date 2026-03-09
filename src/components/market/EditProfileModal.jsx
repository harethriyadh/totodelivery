import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    MapPin,
    User,
    X,
    Save,
    LocateFixed,
    GitBranch,
    AlertTriangle,
} from 'lucide-react';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import TrackOrderMap from '../driver/TrackOrderMap';
import { isWithinServiceArea } from '../../utils/geofencing';
import { MAP_CONFIG } from '../../config/mapConfig';
import StatusModal from '../shared/StatusModal';
import { Store as StoreIcon, Pencil } from 'lucide-react';
import { apiFetch } from '../../utils/api';

// Premium Composite Market Icon with Edit Badge
const marketLocationIcon = L.divIcon({
    html: renderToStaticMarkup(
        <div className="relative w-[52px] h-[52px] flex items-center justify-center">
            {/* Outer Glow/Ring */}
            <div className="absolute inset-0 bg-primary-500/20 rounded-[18px] animate-pulse"></div>

            {/* Main Shop Container */}
            <div className="relative w-11 h-11 bg-white rounded-[15px] border-2 border-primary-500 shadow-xl flex items-center justify-center overflow-visible">
                <StoreIcon size={24} className="text-primary-600" />

                {/* Edit Pencil Badge - Attached to corner */}
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-secondary-500 rounded-lg border-2 border-white shadow-lg flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
                    <Pencil size={11} className="text-white" strokeWidth={3} />
                </div>
            </div>

            {/* Bottom Pointer/Tail */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary-500 rotate-45 rounded-sm shadow-lg"></div>
        </div>
    ),
    className: 'custom-market-icon-wrapper',
    iconSize: [52, 52],
    iconAnchor: [26, 52],
    popupAnchor: [0, -52],
});

const EditProfileModal = ({ isOpen, onClose, initialData, onSave }) => {
    const [formData, setFormData] = useState(initialData);
    const [alertConfig, setAlertConfig] = useState({ open: false, title: '', message: '', type: 'error' });
    const [loadingGPS, setLoadingGPS] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [mapCenterTrigger, setMapCenterTrigger] = useState(0);

    const mapContainerRef = useRef(null);

    useEffect(() => {
        if (isOpen) setFormData(initialData);
    }, [isOpen, initialData]);

    const showAlert = (title, message, type = 'error') => {
        setAlertConfig({ open: true, title, message, type });
    };

    // Auto-center on mount
    useEffect(() => {
        if (isOpen) {
            const savedLocation = localStorage.getItem('last_known_location');
            if (savedLocation) {
                const parsed = JSON.parse(savedLocation);
                setFormData(prev => ({ ...prev, storeLocation: parsed }));
            } else {
                handleLocate();
            }
        }
    }, [isOpen]);

    const handleLocationSelect = (newPos) => {
        if (isWithinServiceArea(newPos[0], newPos[1])) {
            setFormData(prev => ({ ...prev, storeLocation: newPos }));
            localStorage.setItem('last_known_location', JSON.stringify(newPos));
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
                setMapCenterTrigger(prev => prev + 1);
                setLoadingGPS(false);
            },
            (err) => {
                setLoadingGPS(false);
                showAlert('فشل تحديد الموقع', 'يرجى التأكد من تفعيل صلاحيات الوصول للموقع في إعدادات المتصفح.', 'error');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleSave = async () => {
        if (!formData.market_name?.trim() && !formData.ownerName?.trim()) {
            showAlert('خطأ في البيانات', 'يرجى إدخال اسم المتجر للمتابعة.', 'error');
            return;
        }
        setSaving(true);
        setSaveError(null);
        try {
            const payload = {};
            if (formData.market_name) payload.market_name = formData.market_name;
            if (formData.branch_name) payload.branch_name = formData.branch_name;
            if (formData.storeLocation) {
                payload.location = {
                    coordinates: [formData.storeLocation[1], formData.storeLocation[0]] // [lng, lat]
                };
            }
            const response = await apiFetch('/profile/market', {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const data = await response.json();
                onSave(data?.data || formData);
                onClose();
            } else {
                const errData = await response.json().catch(() => ({}));
                setSaveError(errData.message || 'فشل حفظ التغييرات على الخادم.');
            }
        } catch (err) {
            setSaveError('خطأ في الاتصال بالشبكة.');
        } finally {
            setSaving(false);
        }
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

                    <div className="flex-1 overflow-y-auto">
                        <div
                            ref={mapContainerRef}
                            className="h-[360px] sm:h-[400px] w-full overflow-hidden border-b border-neutral-100 relative group bg-neutral-50 shadow-inner rounded-none"
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
                                markerIcon={marketLocationIcon}
                                centerTrigger={mapCenterTrigger}
                            />
                        </div>

                        <div className="px-6 py-6 space-y-6">
                            {/* GPS Action Button - Placed Under the Map */}
                            <button
                                onClick={handleLocate}
                                disabled={loadingGPS}
                                className="w-full py-3.5 bg-neutral-50 border border-neutral-100 rounded-xl flex items-center justify-center gap-3 text-neutral-600 font-bold text-xs hover:bg-neutral-100 active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                <LocateFixed className={loadingGPS ? "animate-spin" : ""} size={16} />
                                {loadingGPS ? 'جاري تحديد موقعك...' : 'استخدم موقعي الحالي (GPS)'}
                            </button>

                            {saveError && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-red-700 font-bold">{saveError}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-5">
                                <div className="space-y-1.5 text-right">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mr-1">اسم المتجر</label>
                                    <div className="relative group">
                                        <User className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors w-4 h-4" />
                                        <input
                                            type="text"
                                            value={formData.market_name || formData.ownerName || ''}
                                            onChange={(e) => setFormData({ ...formData, market_name: e.target.value, ownerName: e.target.value })}
                                            className="w-full bg-neutral-50 border border-neutral-100 rounded-xl pr-12 pl-5 py-3.5 text-sm font-bold text-neutral-900 outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all text-right"
                                            dir="rtl"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 text-right">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mr-1">اسم الفرع</label>
                                    <div className="relative group">
                                        <GitBranch className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-primary-500 transition-colors w-4 h-4" />
                                        <input
                                            type="text"
                                            value={formData.branch_name || ''}
                                            onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
                                            className="w-full bg-neutral-50 border border-neutral-100 rounded-xl pr-12 pl-5 py-3.5 text-sm font-bold text-neutral-900 outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all text-right"
                                            dir="rtl"
                                            placeholder="مثال: فرع النعيم"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-5 py-4 bg-white border-t border-neutral-100 flex items-center gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-[2] py-3.5 rounded-xl bg-primary-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 hover:bg-primary-600 active:scale-[0.98] transition-all disabled:opacity-60"
                        >
                            {saving ? <span className="animate-spin">⏳</span> : <Save size={18} />}
                            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 py-3.5 rounded-xl bg-neutral-50 text-neutral-500 font-bold text-sm hover:bg-neutral-100 active:scale-[0.98] transition-all"
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
