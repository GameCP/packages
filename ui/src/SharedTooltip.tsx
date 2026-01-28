import React from 'react';
import { Tooltip } from 'react-tooltip';

interface SharedTooltipProps {
  id: string;
  place?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  delayShow?: number;
  delayHide?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  variant?: 'default' | 'help';
}

export default function SharedTooltip({
  id,
  place = 'top',
  offset = 0,
  delayShow = 200,
  delayHide = 100,
  className = '',
  style = {},
  children,
  variant = 'default',
}: SharedTooltipProps) {
  // Font sizes defined inline to prevent CSS inheritance issues
  const variantConfig = {
    default: { className: '!px-2 !py-1', fontSize: '0.75rem' }, // 12px
    help: { className: '!px-3 !py-2 !max-w-xs', fontSize: '0.875rem' }, // 14px
  };

  const config = variantConfig[variant];

  return (
    <Tooltip
      id={id}
      place={place}
      offset={offset}
      delayShow={delayShow}
      delayHide={delayHide}
      noArrow
      className={`!bg-popover !text-popover-foreground !border !border-border !shadow-md !rounded-md !z-[1000000] !opacity-100 ${config.className} ${className}`}
      style={{ fontSize: config.fontSize, lineHeight: '1.5', ...style }}
      positionStrategy="fixed"
      render={children ? () => <>{children}</> : undefined}
    />
  );
}
