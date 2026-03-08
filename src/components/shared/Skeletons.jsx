import React from 'react';
import { clsx } from 'clsx';

export const Skeleton = ({ className, ...props }) => {
    return (
        <div className={clsx("animate-pulse rounded-md bg-neutral-200/60", className)} {...props} />
    );
};

export const InventoryCardSkeleton = () => (
    <div className="bg-white rounded-[20px] p-3 shadow-sm border border-neutral-100 flex flex-col gap-2 relative overflow-hidden h-full">
        <Skeleton className="w-full aspect-[4/3] rounded-xl" />
        <div className="space-y-2 mt-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex justify-between items-center mt-auto pt-3">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-6 w-12 rounded-full" />
        </div>
    </div>
);

export const OrderCardSkeleton = () => (
    <div className="app-card border border-neutral-100 p-5 mb-4">
        <div className="flex justify-between items-start mb-4">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex gap-4 mb-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-4 w-20 rounded-full mt-2" />
            </div>
        </div>
        <div className="space-y-3 mb-5">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
    </div>
);

export const DriverOrderSkeleton = () => (
    <div className="app-card p-5 border border-neutral-100 mb-4 group">
        <div className="flex justify-between items-start mb-5">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex gap-4 mb-6">
            <Skeleton className="w-16 h-16 rounded-xl" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
        <div className="flex items-center justify-between pt-5 border-t border-neutral-50">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-32 rounded-[50px]" />
        </div>
    </div>
);
