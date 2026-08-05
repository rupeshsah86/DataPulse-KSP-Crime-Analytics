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
        critical: 'bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/20 font-semibold',
        high: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-semibold',
        medium: 'bg-yellow-500/15 text-yellow-800 dark:text-yellow-400 border border-yellow-500/20 font-semibold',
        low: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-semibold',
        open: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/20 font-semibold',
        investigating: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20 font-semibold',
        closed: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border border-slate-500/20 font-semibold',
        'cold-case': 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/20 font-semibold',
        default: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border border-slate-500/20 font-semibold',
    };

    return (
        <span
            className={cn(
                'px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center',
                variants[variant] || variants.default,
                className
            )}
        >
            {children}
        </span>
    );
};