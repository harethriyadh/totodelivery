import React from 'react';
import { LogOut, FileText, CreditCard as CardIcon, ChevronLeft, ShieldCheck, Truck, UserCircle, Star, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MenuItem = ({ icon: Icon, label, status, onClick, danger }) => (
    <button
        onClick={onClick}
        className="w-full bg-white px-6 py-5.5 flex items-center justify-between border-b border-neutral-50 active:bg-neutral-50 transition-colors tap-active"
    >
        <div className="flex items-center gap-4.5">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${danger ? 'bg-red-50' : 'bg-primary-50'}`}>
                <Icon className={`w-6 h-6 ${danger ? 'text-red-500' : 'text-primary-500'}`} />
            </div>
            <div className="text-right">
                <p className={`text-[15px] font-black ${danger ? 'text-red-500' : 'text-neutral-900'}`}>{label}</p>
                {status && <p className="text-[10px] text-gray-400 font-bold tracking-tight mt-0.5">{status}</p>}
            </div>
        </div>
        <ChevronLeft className={`w-5 h-5 ${danger ? 'text-red-200' : 'text-neutral-200'}`} strokeWidth={2.5} />
    </button>
);

const DriverProfile = ({ onBack }) => {
    const { logout } = useAuth();
    return (
        <div className="flex flex-col h-full bg-white viewport-scroll">
            {/* Header / Nav */}
            <div className="px-6 py-4 flex items-center mb-2">
                <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-neutral-50 rounded-full text-neutral-800">
                    <ArrowLeft className="w-5 h-5 rtl-flip" />
                </button>
            </div>
            {/* Header Section */}
            <div className="p-10 pb-10 text-center">
                <div className="relative inline-block mb-6">
                    <img
                        src="https://ui-avatars.com/api/?name=Ahmed+Ali&background=49A06D&color=ffffff&size=180"
                        className="w-28 h-28 rounded-[36px] border-4 border-primary-50 object-cover shadow-xl shadow-primary-500/10"
                        alt="Profile"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-primary-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full border-2 border-white shadow-lg">
                        9.8 ★
                    </div>
                </div>
                <h3 className="text-2xl font-black text-neutral-900 leading-tight tracking-tight">أحمد علي محمد</h3>
                <p className="text-sm text-gray-400 font-bold mt-1 uppercase tracking-widest">كابتن شريك • الفئة الماسية</p>
            </div>

            <div className="flex-1 bg-neutral-50 pt-4 rounded-t-[40px] border-t border-neutral-100">
                <div className="bg-white rounded-[32px] overflow-hidden mx-4 mb-6 shadow-card border border-neutral-100/50">
                    <MenuItem icon={UserCircle} label="المعلومات الشخصية" status="تعديل الاسم، الجوال" />
                </div>

                <div className="bg-white rounded-[32px] overflow-hidden mx-4 mb-10 shadow-card border border-neutral-100/50">
                    <MenuItem icon={ShieldCheck} label="مركز المساعدة والدعم" />
                    <MenuItem icon={LogOut} label="تسجيل الخروج" danger onClick={logout} />
                </div>
            </div>
        </div>
    );
};

export default DriverProfile;
