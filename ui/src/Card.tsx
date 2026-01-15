'use client';

import React, { ReactNode, useState } from 'react';
import { IconType } from 'react-icons';
import { DropDownArrow } from './DropDown';

// Base card props
interface BaseCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

// Padding variants
type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

// Border accent variants
type BorderAccent =
  | 'none'
  | 'success'
  | 'info'
  | 'danger'
  | 'amber'
  | 'purple'
  | 'orange'
  | 'gray';

// Card variants
type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';

// Interactive card props
interface InteractiveCardProps extends BaseCardProps {
  hover?: boolean;
  clickable?: boolean;
}

// Header card props
interface HeaderCardProps extends InteractiveCardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  icon?: IconType;
  iconColor?:
  | 'success'
  | 'info'
  | 'danger'
  | 'amber'
  | 'purple'
  | 'orange'
  | 'gray'
  | 'indigo'
  | 'pink';
  iconSize?: 'sm' | 'md' | 'lg';
  actionButton?: ReactNode;
  headerClassName?: string;
}

// Accordion card props
interface AccordionCardProps extends HeaderCardProps {
  accordion?: boolean;
  defaultExpanded?: boolean;
  onToggle?: (isExpanded: boolean) => void;
  contentClassName?: string;
}

// Status card props
interface StatusCardProps extends HeaderCardProps {
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  statusIcon?: ReactNode;
  statusText?: string;
}

// Main card component props
interface CardProps extends AccordionCardProps, StatusCardProps {
  padding?: CardPadding;
  borderAccent?: BorderAccent;
  variant?: CardVariant;
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  minHeight?: string;
  maxHeight?: string;
  id?: string;
  headerBorder?: string;
  headerBg?: string;
  headerStatus?: 'online' | 'offline' | 'maintenance' | 'error' | 'restarting' | 'starting' | 'success' | 'info' | 'updating' | 'unknown';
}

// Padding class mapping
const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

// Border accent class mapping
const borderAccentClasses: Record<BorderAccent, string> = {
  none: '',
  success: 'border-l-4 border-l-success',
  info: 'border-l-4 border-l-info',
  danger: 'border-l-4 border-l-danger',
  amber: 'border-l-4 border-l-amber',
  purple: 'border-l-4 border-l-purple',
  orange: 'border-l-4 border-l-orange',
  gray: 'border-l-4 border-l-gray',
};

// Variant class mapping
const variantClasses: Record<CardVariant, string> = {
  default: 'card',
  elevated: 'card shadow-lg border border-border',
  outlined: 'card rounded-lg border-2 border-border',
  filled: 'bg-muted rounded-lg border border-border',
};

// Icon color class mapping
const iconColorClasses: Record<string, string> = {
  success: 'text-success',
  info: 'text-info',
  danger: 'text-danger',
  amber: 'text-amber',
  purple: 'text-purple',
  orange: 'text-orange',
  gray: 'text-muted-foreground',
  indigo: 'text-indigo',
  pink: 'text-pink',
};

// Icon size class mapping
const iconSizeClasses: Record<string, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

// Status class mapping
const statusClasses: Record<string, string> = {
  success: 'bg-success/10 border-success',
  warning: 'bg-amber/10 border-amber',
  error: 'bg-danger/10 border-danger',
  info: 'bg-info/10 border-info',
  neutral: 'bg-muted border-border',
};

export default function Card({
  children,
  className = '',
  onClick,
  disabled = false,
  padding = 'md',
  borderAccent = 'none',
  variant = 'default',
  overflow = 'visible',
  minHeight,
  maxHeight,
  hover = false,
  clickable = false,
  title,
  subtitle,
  description,
  icon: Icon,
  iconColor = 'info',
  iconSize = 'md',
  actionButton,
  headerClassName = '',
  accordion = false,
  defaultExpanded = true,
  onToggle,
  contentClassName = '',
  status,
  statusIcon,
  statusText,
  headerBorder,
  headerBg,
  headerStatus,
  id,
}: CardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Map header status to border and bg classes
  const getHeaderStatusClasses = (status: CardProps['headerStatus']) => {
    switch (status) {
      case 'online':
      case 'success':
        return { border: 'bg-success', bg: 'status-running-bg-50' };
      case 'offline':
      case 'error':
        return { border: 'bg-destructive', bg: 'status-error-bg-50' };
      case 'maintenance':
      case 'starting':
      case 'info':
        return { border: 'bg-warning', bg: 'status-starting-bg-50' };
      case 'restarting':
      case 'updating':
        return { border: 'bg-orange', bg: 'status-restarting-bg-50' };
      case 'unknown':
        return { border: 'bg-muted-foreground/30', bg: 'bg-muted/10' };
      default:
        return { border: headerBorder, bg: headerBg };
    }
  };

  const statusClassesMapped = getHeaderStatusClasses(headerStatus);
  const activeHeaderBorder = statusClassesMapped?.border || headerBorder;
  const activeHeaderBg = statusClassesMapped?.bg || headerBg;

  // Build base classes
  const baseClasses = [
    variantClasses[variant],
    paddingClasses[padding],
    borderAccentClasses[borderAccent],
    overflow !== 'visible' || activeHeaderBorder ? `overflow-${overflow === 'visible' && activeHeaderBorder ? 'hidden' : overflow}` : '',
    activeHeaderBorder ? 'relative' : '',
    hover ? 'hover:shadow-md transition-shadow' : '',
    clickable || onClick ? 'cursor-pointer' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    status ? statusClasses[status] : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Build style object for dynamic properties
  const style: React.CSSProperties = {};
  if (minHeight) style.minHeight = minHeight;
  if (maxHeight) style.maxHeight = maxHeight;

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  const handleToggle = () => {
    if (accordion) {
      const newExpanded = !isExpanded;
      setIsExpanded(newExpanded);
      onToggle?.(newExpanded);
    }
  };

  return (
    <div
      id={id}
      className={`${baseClasses} ${className}`}
      style={style}
      onClick={clickable || onClick ? handleClick : undefined}
    >
      {/* Header Accent */}
      {activeHeaderBorder && (
        <div className="absolute top-0 left-0 right-0 flex justify-center z-10 pointer-events-none">
          <div className={`h-1.5 w-24 ${activeHeaderBorder} rounded-b-xl shadow-sm`} />
        </div>
      )}

      {/* Header Section */}
      {(title || subtitle || description || Icon || actionButton || status) && (
        <div className={`${activeHeaderBg ? activeHeaderBg + ' ' : ''}${headerClassName}${activeHeaderBorder ? ' pt-6 pb-4 px-4' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {/* Icon */}
              {Icon && (
                <div className={`${iconColorClasses[iconColor]} flex-shrink-0`}>
                  <Icon className={iconSizeClasses[iconSize]} />
                </div>
              )}

              {/* Status Icon */}
              {statusIcon && <div className="flex-shrink-0">{statusIcon}</div>}

              {/* Title and Description */}
              <div className="min-w-0 flex-1">
                {title && (
                  <h3 className="text-lg font-semibold text-foreground truncate">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-sm font-medium text-muted-foreground truncate">
                    {subtitle}
                  </p>
                )}
                {description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {description}
                  </p>
                )}
                {statusText && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {statusText}
                  </p>
                )}
              </div>
            </div>

            {/* Action Button */}
            {actionButton && (
              <div className="flex-shrink-0 ml-4">{actionButton}</div>
            )}

            {/* Accordion Toggle */}
            {accordion && (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  handleToggle();
                }}
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? 'Hide' : 'Show'} ${title || 'content'}`}
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors ml-4"
              >
                <span className="mr-1">{isExpanded ? 'Hide' : 'Show'}</span>
                <DropDownArrow
                  isOpen={isExpanded}
                  size="sm"
                  color="gray"
                  aria-hidden={true}
                />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content Section */}
      <div
        className={`${contentClassName} ${accordion && !isExpanded ? 'hidden' : ''}`}
      >
        {children}
      </div>
    </div>
  );
}

// Convenience components for common patterns
export function SimpleCard({
  children,
  className = '',
  ...props
}: BaseCardProps) {
  return (
    <Card className={className} {...props}>
      {children}
    </Card>
  );
}

export function HeaderCard({
  title,
  subtitle,
  description,
  icon,
  iconColor,
  iconSize,
  actionButton,
  children,
  className = '',
  ...props
}: HeaderCardProps) {
  return (
    <Card
      title={title}
      subtitle={subtitle}
      description={description}
      icon={icon}
      iconColor={iconColor}
      iconSize={iconSize}
      actionButton={actionButton}
      className={className}
      {...props}
    >
      {children}
    </Card>
  );
}

export function StatusCard({
  status,
  statusIcon,
  statusText,
  children,
  className = '',
  ...props
}: StatusCardProps) {
  return (
    <Card
      status={status}
      statusIcon={statusIcon}
      statusText={statusText}
      className={className}
      {...props}
    >
      {children}
    </Card>
  );
}

export function ClickableCard({
  onClick,
  children,
  className = '',
  ...props
}: InteractiveCardProps) {
  return (
    <Card onClick={onClick} clickable hover className={className} {...props}>
      {children}
    </Card>
  );
}

export function AccordionCard({
  accordion = true,
  children,
  className = '',
  ...props
}: AccordionCardProps) {
  return (
    <Card accordion={accordion} className={className} {...props}>
      {children}
    </Card>
  );
}
