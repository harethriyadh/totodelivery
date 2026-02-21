
import React, { useState } from 'react';
import { LogOut, MapPin, Store } from 'lucide-react';
import TrackOrderMap from '../../components/driver/TrackOrderMap';
import { useAuth } from '../../context/AuthContext';

const MarketProfile = () => {
    const { logout } = useAuth();
    const [address, setAddress] = useState('شارع الملك فهد، حي النعيم');
    const [storeLocation, setStoreLocation] = useState([24.7136, 46.6753]);
    const [hasChanged, setHasChanged] = useState(false);

    const handleLocationSelect = (newPos) => {
        setStoreLocation(newPos);
        setHasChanged(true);
    };

    const handleSaveLocation = () => {
        if (!storeLocation) {
            alert("يرجى اختيار موقع على الخريطة أولاً");
            return;
        }
        setHasChanged(false);
        alert("تم حفظ الموقع بنجاح");
    };

    return (
        <div className="flex flex-col h-full bg-white viewport-scroll pb-24 slide-up">
            {/* Header Section */}
            <div className="p-8 pb-6 text-center">
                <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                        <Store className="w-10 h-10 text-primary-500" />
                    </div>
                </div>
                <h3 className="text-2xl font-black text-neutral-900 leading-tight tracking-tight">توتو ماركت</h3>
                <p className="text-sm text-neutral-400 font-bold mt-1 uppercase tracking-widest">فرع النعيم • موثق</p>
            </div>

            <div className="flex-1 bg-neutral-50 pt-6 px-4 pb-10 rounded-t-[40px] border-t border-neutral-100 space-y-6">

                {/* Address Section */}
                <div className="bg-white rounded-[24px] p-5 shadow-sm border border-neutral-100">
                    <div className="flex items-center gap-2 mb-3 text-primary-600">
                        <MapPin className="w-5 h-5" />
                        <h4 className="font-black text-sm">العنوان مكتوب</h4>
                    </div>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm font-bold text-neutral-900 outline-none focus:border-primary-300 transition-colors"
                    />
                </div>

                {/* Map Integration */}
                <div className="space-y-3">
                    <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-neutral-100 h-64 relative">
                        <TrackOrderMap
                            pickupPos={storeLocation}
                            currentPos={storeLocation}
                            step="PICKUP"
                            gpsError={null}
                            gpsPermission="granted"
                            onMapClick={handleLocationSelect}
                            navLabel="موقع المتجر"
                        />
                    </div>

                    <button
                        onClick={handleSaveLocation}
                        disabled={!hasChanged}
                        className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${hasChanged
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                            }`}
                    >
                        <MapPin className="w-5 h-5" />
                        حفظ الموقع المختار
                    </button>
                    {!hasChanged && (
                        <p className="text-[10px] text-neutral-400 font-bold text-center px-4">
                            اضغط على الخريطة لتحديد موقع المتجر بدقة
                        </p>
                    )}
                </div>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="w-full bg-red-50 text-red-500 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    تسجيل الخروج
                </button>
            </div>
        </div>
    );
};

export default MarketProfile;
