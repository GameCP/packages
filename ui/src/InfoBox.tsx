import React from 'react';
import Card from './Card';

interface InfoBoxProps {
    title: string;
    children: React.ReactNode;
    variant?: 'default' | 'warning' | 'info' | 'success' | 'danger';
    className?: string;
}

// Map InfoBox variants to Card borderAccent and title colors
const variantConfig: Record<string, { borderAccent: 'none' | 'success' | 'info' | 'danger' | 'amber' | 'purple' | 'orange' | 'gray', titleColor: string }> = {
    default: { borderAccent: 'gray', titleColor: 'text-foreground' },
    warning: { borderAccent: 'amber', titleColor: 'text-amber' },
    info: { borderAccent: 'info', titleColor: 'text-info' },
    success: { borderAccent: 'success', titleColor: 'text-success' },
    danger: { borderAccent: 'danger', titleColor: 'text-danger' },
};

export default function InfoBox({
    title,
    children,
    variant = 'default',
    className = ''
}: InfoBoxProps) {
    const config = variantConfig[variant] || variantConfig.default;

    return (
        <Card
            borderAccent={config.borderAccent}
            padding="md"
            className={className}
        >
            <h4 className={`font-medium mb-2 ${config.titleColor}`}>
                {title}
            </h4>
            <div className="text-sm text-muted-foreground space-y-1 [&>ul]:list-disc [&>ul]:list-outside [&>ul]:pl-3 [&>ol]:list-decimal [&>ol]:list-outside [&>ol]:pl-4">
                {children}
            </div>
        </Card>
    );
}

