import React from 'react';
import {
    RiInformationLine,
    RiErrorWarningLine,
    RiCheckLine,
    RiAlertLine,
} from 'react-icons/ri';

interface NoticeProps {
    /** Main content of the notice */
    children: React.ReactNode;

    /** Variant type of the notice */
    variant?: 'info' | 'warning' | 'success' | 'danger' | 'default';

    /** Icon to display. If not provided, uses default for variant */
    icon?: React.ReactNode;

    /** Optional title */
    title?: string | React.ReactNode;

    /** Additional CSS classes */
    className?: string;

    /** Whether to show the icon */
    showIcon?: boolean;

    /** Custom content to the right (e.g., a toggle button) */
    action?: React.ReactNode;

    /** Compact mode for inline usage (less padding, smaller text) */
    compact?: boolean;
}

const variantStyles = {
    info: {
        bg: 'bg-info/5',
        accent: 'bg-info',
        iconBg: 'bg-info/10',
        iconColor: 'text-info',
        titleColor: 'text-info',
    },
    warning: {
        bg: 'bg-amber/5',
        accent: 'bg-amber',
        iconBg: 'bg-amber/10',
        iconColor: 'text-amber',
        titleColor: 'text-amber',
    },
    success: {
        bg: 'bg-success/5',
        accent: 'bg-success',
        iconBg: 'bg-success/10',
        iconColor: 'text-success',
        titleColor: 'text-success',
    },
    danger: {
        bg: 'bg-danger/5',
        accent: 'bg-danger',
        iconBg: 'bg-danger/10',
        iconColor: 'text-danger',
        titleColor: 'text-danger',
    },
    default: {
        bg: 'bg-muted/50',
        accent: 'bg-border',
        iconBg: 'bg-muted',
        iconColor: 'text-muted-foreground',
        titleColor: 'text-foreground',
    },
};

const defaultIcons = {
    info: RiInformationLine,
    warning: RiAlertLine,
    success: RiCheckLine,
    danger: RiErrorWarningLine,
    default: RiInformationLine,
};

export default function Notice({
    children,
    variant = 'info',
    icon,
    title,
    className = '',
    showIcon = true,
    action,
    compact = false,
}: NoticeProps) {
    const styles = variantStyles[variant] || variantStyles.default;
    const IconComponent = defaultIcons[variant] || defaultIcons.default;

    // Sizing based on compact mode
    const padding = compact ? 'px-3 py-2.5' : 'px-4 py-4';
    const iconSize = compact ? 'w-4 h-4' : 'w-5 h-5';
    const iconPadding = compact ? 'p-1.5' : 'p-2';
    const textSize = compact ? 'text-xs' : 'text-sm';
    const titleSize = compact ? 'text-sm' : 'text-base';
    const gap = compact ? 'gap-2.5' : 'gap-3';

    const displayIcon = showIcon ? (
        icon || <IconComponent className={iconSize} />
    ) : null;

    return (
        <div
            className={`relative flex items-start ${gap} ${padding} rounded-lg overflow-hidden ${styles.bg} ${className}`}
        >
            {/* Left accent bar */}
            <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${styles.accent}`}
            />

            {/* Icon in pill */}
            {displayIcon && (
                <div
                    className={`flex-shrink-0 ${iconPadding} rounded-lg ${styles.iconBg} ${styles.iconColor}`}
                >
                    {displayIcon}
                </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
                {title && (
                    <div className={`font-medium ${titleSize} ${styles.titleColor} mb-1`}>
                        {title}
                    </div>
                )}
                <div className={`${textSize} text-muted-foreground leading-relaxed space-y-1 [&>ul]:list-disc [&>ul]:list-outside [&>ul]:pl-3 [&>ol]:list-decimal [&>ol]:list-outside [&>ol]:pl-4`}>
                    {children}
                </div>
            </div>

            {/* Action */}
            {action && <div className="flex-shrink-0">{action}</div>}
        </div>
    );
}

// Convenience components
export function InfoNotice(props: Omit<NoticeProps, 'variant'>) {
    return <Notice variant="info" {...props} />;
}

export function WarningNotice(props: Omit<NoticeProps, 'variant'>) {
    return <Notice variant="warning" {...props} />;
}

export function SuccessNotice(props: Omit<NoticeProps, 'variant'>) {
    return <Notice variant="success" {...props} />;
}

export function DangerNotice(props: Omit<NoticeProps, 'variant'>) {
    return <Notice variant="danger" {...props} />;
}
