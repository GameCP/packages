'use client';

import { RiCloseLine } from 'react-icons/ri';

interface ClearButtonProps {
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'overlay' | 'inline' | 'ghost';
  tooltipId?: string;
  tooltipContent?: string;
}

export default function ClearButton({
  onClick,
  className = '',
  size = 'sm',
  variant = 'overlay',
  tooltipId,
  tooltipContent = 'Clear',
}: ClearButtonProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const variantClasses = {
    overlay:
      'absolute -top-1 -right-1 bg-red-500  rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer',
    inline:
      'bg-red-500  rounded-full flex items-center justify-center hover:bg-red-600 transition-colors',
    ghost:
      'text-muted-foreground hover:text-muted-foreground transition-colors',
  };

  const baseProps = {
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick(e);
    },
    className: `${sizeClasses[size]} ${variantClasses[variant]} ${className}`,
    title: tooltipContent,
  };

  const tooltipProps = tooltipId
    ? {
        'data-tooltip-id': tooltipId,
        'data-tooltip-content': tooltipContent,
      }
    : {};

  // Use span for overlay variant to avoid nested buttons
  const Element = variant === 'overlay' ? 'span' : 'button';

  return (
    <Element {...baseProps} {...tooltipProps}>
      <RiCloseLine className={iconSizeClasses[size]} />
    </Element>
  );
}
