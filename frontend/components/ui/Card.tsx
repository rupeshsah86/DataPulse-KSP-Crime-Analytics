import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    title?: string;
    subtitle?: string;
}

export const Card: React.FC<CardProps> = ({
    children,
    className,
    hover = true,
    title,
    subtitle,
}) => {
    return (
        <div
            className={cn(
                'bg-white rounded-xl shadow-sm border border-slate-200 p-6',
                hover && 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
                className
            )}
        >
            {title && (
                <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
            )}
            {subtitle && (
                <p className="text-sm font-medium text-slate-500 mb-4">{subtitle}</p>
            )}
            {children}
        </div>
    );
};