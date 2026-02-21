import React from 'react';
import { Bell, ArrowRight, CheckCircle, Info, Clock, ChevronLeft } from 'lucide-react';

const Notifications = ({ onBack }) => {
    const notifications = [
        {
            id: 1,
            title: 'تم إيداع الأرباح',
            description: 'تم تحويل مبلغ 450.00 د.ع إلى محفظتك بنجاح.',
            time: 'منذ ساعتين',
            type: 'success'
        },
        {
            id: 2,
            title: 'تحديث أمان جديد',
            description: 'يرجى مراجعة سياسة الخصوصية الجديدة الخاصة بتوتو.',
            time: 'منذ 5 ساعات',
            type: 'info'
        },
        {
            id: 3,
            title: 'عرض محدود!',
            description: 'احصل على مكافأة إضافية عند إكمال 10 رحلات اليوم.',
            time: 'منذ يوم واحد',
            type: 'promo'
        }
    ];

    return (
        <div className="flex flex-col h-full bg-[#F8FAFC] slide-up">
            {/* Header */}
            <header className="px-6 py-5 bg-white flex justify-between items-center sticky top-0 z-30 border-b border-neutral-100 shadow-sm">
                <button
                    onClick={onBack}
                    className="w-10 h-10 flex items-center justify-center bg-neutral-50 rounded-full text-neutral-800 tap-active shadow-sm border border-neutral-100"
                >
                    <ArrowRight className="w-5 h-5 rtl-flip" />
                </button>
                <h2 className="text-xl font-black text-neutral-900 flex-1 text-center pr-10">التنبيهات</h2>
            </header>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                {notifications.map((notif) => (
                    <div key={notif.id} className="app-card p-5 flex gap-4 tap-active active:bg-neutral-50 transition-all active:scale-[0.98]">
                        <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center shrink-0 shadow-sm border ${notif.type === 'success' ? 'bg-emerald-50 text-emerald-500 border-emerald-100/50' :
                            notif.type === 'info' ? 'bg-blue-50 text-blue-500 border-blue-100/50' : 'bg-amber-50 text-amber-500 border-amber-100/50'
                            }`}>
                            {notif.type === 'success' ? <CheckCircle className="w-7 h-7" /> :
                                notif.type === 'info' ? <Info className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                        </div>
                        <div className="flex-1 text-right">
                            <h3 className="font-black text-neutral-900 text-[15px] mb-1">{notif.title}</h3>
                            <p className="text-xs text-neutral-400 font-bold leading-relaxed">{notif.description}</p>
                            <span className="text-[10px] text-neutral-300 font-black mt-2.5 block">{notif.time}</span>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-neutral-200 self-center" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
