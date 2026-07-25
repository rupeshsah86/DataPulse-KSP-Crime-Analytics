import React from 'react';
import { cn } from '@/utils/cn';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    className,
}) => {
    const sizes = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
    };

    return (
        <div
            className={cn(
                'rounded-full border-primary-500 border-t-transparent animate-spin',
                sizes[size],
                className
            )}
        />
    );
};