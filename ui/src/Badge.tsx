'use client';

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
  | 'yellow'
  | 'orange'
  | 'teal'
  | 'cyan'
  | 'lime'
  | 'emerald'
  | 'rose'
  | 'sky'
  | 'violet'
  | 'fuchsia'
  | 'amber'
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

const badgeVariants: Record<Exclude<BadgeVariant, 'custom'>, string> = {
  default: 'bg-gray-100 text-foreground border-border',
  primary: 'bg-primary-100 text-primary-800 border-primary-200',
  secondary: 'bg-gray-100 text-foreground border-border',
  success: 'bg-success text-success-dark border-success-light',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-muted text-muted-foreground border-ring',
  gray: 'bg-gray-100 text-foreground border-border',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  pink: 'bg-pink-100 text-pink-800 border-pink-200',
  indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  teal: 'bg-teal-100 text-teal-800 border-teal-200',
  cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  lime: 'bg-lime-100 text-lime-800 border-lime-200',
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rose: 'bg-rose-100 text-rose-800 border-rose-200',
  sky: 'bg-sky-100 text-sky-800 border-sky-200',
  violet: 'bg-violet-100 text-violet-800 border-violet-200',
  fuchsia: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
  amber: 'bg-amber-100 text-amber-800 border-amber-200',
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
