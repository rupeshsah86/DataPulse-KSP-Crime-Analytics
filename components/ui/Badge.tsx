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
        critical: 'bg-red-100 text-red-800',
        high: 'bg-orange-100 text-orange-800',
        medium: 'bg-yellow-100 text-yellow-800',
        low: 'bg-green-100 text-green-800',
        open: 'bg-blue-100 text-blue-800',
        investigating: 'bg-cyan-100 text-cyan-800',
        closed: 'bg-gray-100 text-gray-800',
        'cold-case': 'bg-purple-100 text-purple-800',
        default: 'bg-gray-100 text-gray-600',
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