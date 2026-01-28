import React from 'react';

export interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    id?: string;
}

const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-4 lg:p-6',
    lg: 'px-4 sm:px-6 lg:px-6 py-6',
};

export default function Container({
    children,
    className = '',
    padding = 'md',
    id
}: ContainerProps) {
    return (
        <div id={id} className={`${paddingClasses[padding]} ${className}`}>
            {children}
        </div>
    );
}
