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
}

export default function SharedTooltip({
  id,
  place = 'top',
  offset = 8,
  delayShow = 200,
  delayHide = 100,
  className = '',
  style = {},
  children,
}: SharedTooltipProps) {
  return (
    <Tooltip
      id={id}
      place={place}
      offset={offset}
      delayShow={delayShow}
      delayHide={delayHide}
      className={`!bg-popover !text-popover-foreground !border !border-border !shadow-md !text-xs !px-2 !py-1 !rounded-md z-50 ${className}`}
      style={style}
      positionStrategy="fixed"
      render={children ? () => <>{children}</> : undefined}
    />
  );
}
