import React, { useState } from 'react';
import {
    LogOut,
    MapPin,
    Store,
    User,
    Phone,
    Edit3,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SERVICE_AREA } from '../../utils/geofencing';
import EditProfileModal from '../../components/market/EditProfileModal';
import LogoutConfirmModal from '../../components/shared/LogoutConfirmModal';

const MarketProfile = () => {
    const { logout } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [userData, setUserData] = useState({
        ownerName: 'حارث الرياض',
        phone1: '07701234567',
        address: 'حي النعيم، شارع 45، بناية 12',
        storeLocation: [SERVICE_AREA.center.lat, SERVICE_AREA.center.lng]
    });

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