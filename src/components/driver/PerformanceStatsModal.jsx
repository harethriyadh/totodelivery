import React from 'react';
import { createPortal } from 'react-dom';
import { X, Star, TrendingUp, Award, Zap } from 'lucide-react';

const PerformanceStatsModal = ({ isOpen, onClose, stats }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[10000] bg-neutral-900/60 backdrop-blur-[12px] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                <div className="px-6 py-5 border-b border-neutral-100 flex justify-between items-center">
                    <h2 className="text-xl font-black text-neutral-900">إحصائيات الأداء</h2>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-5 bg-primary-50 rounded-3xl text-center">
                            <Star className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                            <p className="text-2xl font-black text-primary-700">{stats.rating}</p>
                            <p className="text-[10px] font-bold text-primary-500 uppercase">التقييم العام</p>
                        </div>
                        <div className="p-5 bg-blue-50 rounded-3xl text-center">
                            <Award className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                            <p className="text-2xl font-black text-blue-700">{stats.trips}</p>
                            <p className="text-[10px] font-bold text-blue-500 uppercase">إجمالي الرحلات</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 border border-neutral-100 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500">
                                    <TrendingUp size={18} />
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-neutral-900">نسبة القبول</p>
                                    <p className="text-[10px] text-neutral-400 font-bold">آخر 30 يوم</p>
                                </div>
                            </div>
                            <span className="text-lg font-black text-green-600">98%</span>
                        </div>

                        <div className="p-4 border border-neutral-100 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
                                    <Zap size={18} />
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-neutral-900">سرعة التوصيل</p>
                                    <p className="text-[10px] text-neutral-400 font-bold">متوسط الوقت</p>
                                </div>
                            </div>
                            <span className="text-lg font-black text-purple-600">24 دقيقة</span>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-neutral-900 rounded-2xl text-center">
                        <p className="text-xs text-neutral-400 font-bold mb-1">أنت حالياً في فئة</p>
                        <p className="text-lg font-black text-white tracking-widest uppercase">الفئة الماسية</p>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default PerformanceStatsModal;
