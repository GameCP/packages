import React from 'react';

interface InfoBoxProps {
    title: string;
    children: React.ReactNode;
    variant?: 'default' | 'warning' | 'info' | 'success';
    className?: string;
}

const variantStyles = {
    default: 'bg-accent border-border text-muted-foreground',
    warning: 'bg-amber/10 border-amber text-amber',
    info: 'bg-info/10 border-info text-info',
    success: 'bg-success/10 border-success text-success',
};

const titleStyles = {
    default: 'text-foreground',
    warning: 'text-amber',
    info: 'text-info',
    success: 'text-success',
};

export default function InfoBox({
    title,
    children,
    variant = 'default',
    className = ''
}: InfoBoxProps) {
    return (
        <div className={`border rounded-md p-4 ${variantStyles[variant]} ${className}`}>
            <h4 className={`font-medium mb-2 ${titleStyles[variant]}`}>
                {title}
            </h4>
            <div className="text-sm space-y-1 [&>ul]:list-disc [&>ul]:list-outside [&>ul]:pl-3 [&>ol]:list-decimal [&>ol]:list-outside [&>ol]:pl-4">
                {children}
            </div>
        </div>
    );
}
