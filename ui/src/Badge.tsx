import React from 'react';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'gray'
  | 'purple'
  | 'pink'
  | 'indigo'
  | 'amber'
  | 'orange'
  | 'yellow'
  | 'teal'
  | 'cyan'
  | 'lime'
  | 'emerald'
  | 'rose'
  | 'sky'
  | 'violet'
  | 'fuchsia'
  | 'custom';

export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  customColors?: {
    background: string;
    text: string;
    border?: string;
  };
}

// Badge variant styles using semantic color classes where applicable
const badgeVariants: Record<Exclude<BadgeVariant, 'custom'>, string> = {
  default: 'bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80',
  primary: 'bg-primary text-primary-foreground border-transparent hover:bg-primary/80',
  secondary: 'bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80',
  success: 'status-running-badge border-transparent',
  warning: 'status-starting-badge border-transparent',
  error: 'status-error-badge border-transparent',
  info: 'bg-muted text-muted-foreground border-ring',
  gray: 'bg-muted text-muted-foreground border-border',
  purple: 'badge-purple',
  pink: 'badge-pink',
  indigo: 'badge-indigo',
  yellow: 'status-starting-badge border-transparent',
  orange: 'status-restarting-badge border-transparent',
  teal: 'badge-teal',
  cyan: 'badge-cyan',
  lime: 'badge-lime',
  emerald: 'badge-emerald',
  rose: 'badge-rose',
  sky: 'badge-sky',
  violet: 'badge-violet',
  fuchsia: 'badge-fuchsia',
  amber: 'status-starting-badge border-transparent',
};

const badgeSizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  customColors,
}: BadgeProps) {
  const baseClasses =
    'inline-flex items-center font-medium rounded-full border';

  const variantClasses = variant === 'custom' ? '' : badgeVariants[variant];

  const sizeClasses = badgeSizes[size];

  const customStyles =
    variant === 'custom' && customColors
      ? {
        backgroundColor: customColors.background,
        color: customColors.text,
        borderColor: customColors.border || customColors.background,
      }
      : {};

  return (
    <span
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      style={customStyles}
    >
      {children}
    </span>
  );
}

// Convenience components for common variants
export const SuccessBadge = (props: Omit<BadgeProps, 'variant'>) => (
  <Badge {...props} variant="success" />
);

export const WarningBadge = (props: Omit<BadgeProps, 'variant'>) => (
  <Badge {...props} variant="warning" />
);

export const ErrorBadge = (props: Omit<BadgeProps, 'variant'>) => (
  <Badge {...props} variant="error" />
);

export const InfoBadge = (props: Omit<BadgeProps, 'variant'>) => (
  <Badge {...props} variant="info" />
);

export const PrimaryBadge = (props: Omit<BadgeProps, 'variant'>) => (
  <Badge {...props} variant="primary" />
);

export const GrayBadge = (props: Omit<BadgeProps, 'variant'>) => (
  <Badge {...props} variant="gray" />
);

// Status badge component for common use cases
export function StatusBadge({
  isActive,
  activeText = 'Active',
  inactiveText = 'Inactive',
  ...props
}: {
  isActive: boolean;
  activeText?: string;
  inactiveText?: string;
} & Omit<BadgeProps, 'children' | 'variant'>) {
  return (
    <Badge {...props} variant={isActive ? 'success' : 'error'}>
      {isActive ? activeText : inactiveText}
    </Badge>
  );
}
