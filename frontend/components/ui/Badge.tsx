import React from 'react';
import { cn } from '@/utils/cn';

type BadgeVariant = 'critical' | 'high' | 'medium' | 'low' | 'open' | 'investigating' | 'closed' | 'cold-case' | 'default';

interface BadgeProps {
    variant?: BadgeVariant;
    children: React.ReactNode;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'default',
    children,
    className,
}) => {
    const variants = {
        critical: 'bg-red-50 text-red-700 border border-red-200 font-bold',
        high: 'bg-amber-50 text-amber-800 border border-amber-200 font-bold',
        medium: 'bg-yellow-50 text-yellow-800 border border-yellow-200 font-bold',
        low: 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold',
        open: 'bg-blue-50 text-blue-800 border border-blue-200 font-bold',
        investigating: 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold',
        closed: 'bg-slate-100 text-slate-700 border border-slate-300 font-bold',
        'cold-case': 'bg-purple-50 text-purple-800 border border-purple-200 font-bold',
        default: 'bg-slate-100 text-slate-700 border border-slate-200 font-semibold',
    };

    return (
        <span
            className={cn(
                'px-2.5 py-0.5 rounded-full text-xs inline-flex items-center',
                variants[variant] || variants.default,
                className
            )}
        >
            {children}
        </span>
    );
};