'use client';

import React from 'react';
import { RiLoader4Line } from 'react-icons/ri';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'alt' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<{ className?: string }>;
}

export default function LoadingButton({
  isLoading = false,
  loadingText,
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  disabled,
  ...props
}: LoadingButtonProps) {
  const baseClasses = '';

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    alt: 'btn-alt',
    danger: 'btn-danger',
    ghost:
      'inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors',
  };

  const sizeClasses = {
    sm: 'h-8 px-3 py-1.5 text-sm',
    md: 'h-9 px-3 py-1.5 text-sm',
    lg: 'h-10 px-4 py-2 text-sm',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-4 h-4',
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-busy={isLoading ? 'true' : 'false'}
      aria-disabled={isDisabled ? 'true' : 'false'}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} nowrap whitespace-nowrap`}
    >
      {isLoading ? (
        <>
          <RiLoader4Line
            className={`${iconSizeClasses[size]} animate-spin`}
            aria-hidden="true"
          />
          {loadingText || children}
        </>
      ) : (
        <>
          {Icon && (
            <Icon className={`${iconSizeClasses[size]}`} aria-hidden="true" />
          )}
          {children}
        </>
      )}
    </button>
  );
}
