import React from 'react';

interface GridProps {
    children: React.ReactNode;
    cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    gap?: 1 | 2 | 3 | 4 | 6 | 8;
    className?: string;
}

export default function Grid({
    children,
    cols = 1,
    gap = 4,
    className = '',
}: GridProps) {
    const colClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
        6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
        12: 'grid-cols-12',
    };

    const gapClasses = {
        1: 'gap-1',
        2: 'gap-2',
        3: 'gap-3',
        4: 'gap-4',
        6: 'gap-6',
        8: 'gap-8',
    };

    return (
        <div className={`grid ${colClasses[cols]} ${gapClasses[gap]} ${className}`}>
            {children}
        </div>
    );
}

export function GridItem({
    children,
    span = 1,
    className = '',
}: {
    children: React.ReactNode;
    span?: number;
    className?: string;
}) {
    return (
        <div className={`col-span-${span} ${className}`}>
            {children}
        </div>
    );
}
