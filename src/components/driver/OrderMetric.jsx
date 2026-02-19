import React from 'react';

const OrderMetric = ({ label, value }) => {
    return (
        <div className="bg-white border border-neutral-100/50 py-4 px-1 rounded-[22px] text-center flex-1 shadow-soft hover:shadow-md transition-shadow duration-300">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-tight">{label}</p>
            <p className="font-black text-sm text-neutral-900">{value}</p>
        </div>
    );
};

export default OrderMetric;
