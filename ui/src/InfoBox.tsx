import React from 'react';

interface InfoBoxProps {
    title: string;
    children: React.ReactNode;
    variant?: 'default' | 'warning' | 'info' | 'success';
    className?: string;
}

const variantStyles = {
    default: 'bg-accent border-border text-muted-foreground',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
};

const titleStyles = {
    default: 'text-foreground',
    warning: 'text-yellow-800 dark:text-yellow-200',
    info: 'text-blue-800 dark:text-blue-200',
    success: 'text-green-800 dark:text-green-200',
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
