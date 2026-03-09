import React, { useState, useEffect } from 'react';
import {
    LogOut,
    MapPin,
    Store,
    User,
    Phone,
    Edit3,
    ChevronDown,
    Check,
    Loader2,
    GitBranch,
    ShieldCheck
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { SERVICE_AREA } from '../../utils/geofencing';
import EditProfileModal from '../../components/market/EditProfileModal';
import LogoutConfirmModal from '../../components/shared/LogoutConfirmModal';

const MARKET_TYPES = [
    { value: 'fruits_veg', label: 'فواكه وخضروات', emoji: '🍎' },
    { value: 'groceries', label: 'بقالة', emoji: '🛒' },
    { value: 'makeup', label: 'مكياج وتجميل', emoji: '💄' },
    { value: 'food', label: 'طعام', emoji: '🍔' },
    { value: 'pharmacy', label: 'صيدلية', emoji: '💊' },
    { value: 'bakery', label: 'مخبوزات', emoji: '🥖' },
    { value: 'other', label: 'أخرى', emoji: '🏪' },
];

const MARKET_TYPE_LABELS = MARKET_TYPES.reduce((acc, curr) => {
    acc[curr.value] = curr;
    return acc;
}, {});

const MarketProfile = () => {
    const { logout, marketType, fetchMarketProfile } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [liveProfile, setLiveProfile] = useState(null);
    const [userData, setUserData] = useState({
        ownerName: '',
        market_name: '',
        branch_name: '',
        address: '',
        storeLocation: [SERVICE_AREA.center.lat, SERVICE_AREA.center.lng]
    });

    // Load live profile on mount
    useEffect(() => {
        const load = async () => {
            setProfileLoading(true);
            const profile = await fetchMarketProfile();
            if (profile) {
                setLiveProfile(profile);
                setUserData(prev => ({
                    ...prev,
                    ownerName: profile.market_name || prev.ownerName,
                    market_name: profile.market_name || '',
                    branch_name: profile.branch_name || '',
                    storeLocation: profile.location?.coordinates
                        ? [profile.location.coordinates[1], profile.location.coordinates[0]] // [lat, lng]
                        : prev.storeLocation
                }));
            }
            setProfileLoading(false);
        };
        load();
    }, []);

    const typeInfo = MARKET_TYPE_LABELS[marketType] || null;
    const verificationStatus = liveProfile?.verification_status || null;
    const isVerified = verificationStatus === 'verified';
    const statusLabel = { active: 'نشط', inactive: 'غير نشط', busy: 'مشغول' }[liveProfile?.status] || '';

    return (
        <div className="flex flex-col h-full bg-[#fcfcfc] pb-24">
            <LogoutConfirmModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={logout}
            />

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={userData}
                onSave={(updatedData) => {
                    const profile = updatedData?.data || updatedData;
                    setLiveProfile(profile);
                    setUserData({
                        ownerName: profile.market_name || '',
                        market_name: profile.market_name || '',
                        branch_name: profile.branch_name || '',
                        address: '',
                        storeLocation: profile.location?.coordinates
                            ? [profile.location.coordinates[1], profile.location.coordinates[0]] // [lat, lng]
                            : userData.storeLocation
                    });
                }}
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

                <h3 className="text-2xl font-black text-neutral-900 mt-6 tracking-tight text-center">
                    {liveProfile?.market_name || 'توتو ماركت'}
                </h3>
                <p className="text-xs font-black text-neutral-400 mt-1">
                    {liveProfile?.branch_name || ''}
                </p>
                <div className="flex items-center gap-2 mt-2">
                    <span className={clsx("w-2 h-2 rounded-full", isVerified ? "bg-green-500 animate-pulse" : "bg-yellow-400")} />
                    <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">
                        {isVerified ? 'المتجر موثق' : 'قيد التوثيق'}
                    </span>
                </div>
                {/* Market Type Badge (READ-ONLY display) */}
                {typeInfo && (
                    <div className="mt-3 px-4 py-1.5 bg-primary-50 border border-primary-100 rounded-full flex items-center gap-2">
                        <span className="text-base">{typeInfo.emoji}</span>
                        <span className="text-xs font-black text-primary-600">{typeInfo.label}</span>
                    </div>
                )}
            </div>

            <div className="px-6 space-y-6">
                <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm divide-y divide-neutral-50 overflow-hidden">
                    {profileLoading ? (
                        <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary-400" /></div>
                    ) : (
                        <>
                            <div className="p-5 flex items-center justify-between">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-neutral-400 uppercase">اسم المتجر</p>
                                    <p className="text-sm font-bold text-neutral-900 mt-0.5">{liveProfile?.market_name || '—'}</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400">
                                    <Store size={18} />
                                </div>
                            </div>
                            <div className="p-5 flex items-center justify-between border-t border-neutral-50">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-neutral-400 uppercase">الفرع</p>
                                    <p className="text-sm font-bold text-neutral-900 mt-0.5">{liveProfile?.branch_name || '—'}</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400">
                                    <GitBranch size={18} />
                                </div>
                            </div>
                            <div className="p-5 flex items-center justify-between border-t border-neutral-50">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-neutral-400 uppercase">حالة التوثيق</p>
                                    <p className={clsx("text-sm font-bold mt-0.5", isVerified ? "text-green-600" : "text-yellow-600")}>
                                        {isVerified ? 'موثق ✓' : 'قيد المراجعة'}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400">
                                    <ShieldCheck size={18} />
                                </div>
                            </div>
                            {statusLabel ? (
                                <div className="p-5 flex items-center justify-between border-t border-neutral-50">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-neutral-400 uppercase">حالة الحساب</p>
                                        <p className="text-sm font-bold text-neutral-900 mt-0.5">{statusLabel}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400">
                                        <User size={18} />
                                    </div>
                                </div>
                            ) : null}
                        </>
                    )}
                </div>

                <button
                    onClick={() => setIsLogoutModalOpen(true)}
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