import React from 'react';
import { TrendingUp, Award } from 'lucide-react';

const EarningsCard = ({ amount, trips }) => {
    return (
        <div className="app-card p-6 flex justify-between items-center mb-6 relative overflow-hidden group">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -translate-y-16 translate-x-16 opacity-30 group-hover:scale-110 transition-transform duration-700"></div>

            <div className="text-right z-10">
                <p className="text-[11px] text-primary-500 font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3" />
                    الأرباح اليومية
                </p>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold text-neutral-900 leading-none">{amount}</span>
                    <span className="text-[11px] font-bold text-neutral-400 uppercase">ر.س</span>
                </div>
            </div>

            <div className="bg-neutral-50 px-5 py-3 rounded-2xl border border-neutral-100 flex flex-col items-center justify-center z-10 shadow-sm">
                <Award className="w-4 h-4 text-secondary-500 mb-1" />
                <p className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">الرحلات</p>
                <div className="text-2xl font-black text-neutral-900 leading-none">{trips}</div>
            </div>
        </div>
    );
};

export default EarningsCard;
