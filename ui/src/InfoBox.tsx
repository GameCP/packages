import React from 'react';
import Notice from './Notice';

interface InfoBoxProps {
    title: string;
    children: React.ReactNode;
    variant?: 'default' | 'warning' | 'info' | 'success' | 'danger';
    className?: string;
    /** Compact mode for inline usage */
    compact?: boolean;
}

/**
 * @deprecated Use Notice component instead. InfoBox is now a wrapper around Notice.
 */
export default function InfoBox({
    title,
    children,
    variant = 'default',
    className = '',
    compact = false,
}: InfoBoxProps) {
    return (
        <Notice
            variant={variant}
            title={title}
            className={className}
            compact={compact}
        >
            {children}
        </Notice>
    );
}
