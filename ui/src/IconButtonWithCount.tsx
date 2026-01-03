'use client';

import { ReactNode } from 'react';
import CountBadge from './CountBadge';
import ClearButton from './ClearButton';

interface IconButtonWithCountProps {
  icon: ReactNode;
  label?: string;
  count?: number;
  onClick: () => void;
  onClear?: () => void;
  showLabel?: boolean;
  className?: string;
  buttonClassName?: string;
  countVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  clearVariant?: 'overlay' | 'inline' | 'ghost';
  tooltipId?: string;
  tooltipContent?: string;
  clearTooltipId?: string;
  clearTooltipContent?: string;
}

export default function IconButtonWithCount({
  icon,
  label,
  count = 0,
  onClick,
  onClear,
  showLabel = true,
  className = '',
  buttonClassName = '',
  countVariant = 'primary',
  clearVariant = 'overlay',
  tooltipId,
  tooltipContent,
  clearTooltipId,
  clearTooltipContent = 'Clear',
}: IconButtonWithCountProps) {
  const hasActiveCount = count > 0;
  const shouldShowLabel = showLabel && !hasActiveCount;

  return (
    <button
      onClick={onClick}
      className={`btn-alt btn-md flex items-center space-x-1 relative ${buttonClassName} ${className}`}
      data-tooltip-id={tooltipId}
      data-tooltip-content={tooltipContent}
    >
      {icon}
      {shouldShowLabel && label && (
        <span className="hidden sm:inline">{label}</span>
      )}
      {hasActiveCount && <CountBadge count={count} variant={countVariant} />}
      {hasActiveCount && onClear && (
        <ClearButton
          onClick={onClear}
          variant={clearVariant}
          tooltipId={clearTooltipId}
          tooltipContent={clearTooltipContent}
        />
      )}
    </button>
  );
}
