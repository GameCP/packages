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
  | 'green'
  | 'blue'
  | 'red'
  | 'yellow'
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
  | 'green'
  | 'blue'
  | 'red'
  | 'yellow'
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
  green: 'border-l-4 border-l-green-500',
  blue: 'border-l-4 border-l-ring',
  red: 'border-l-4 border-l-red-500',
  yellow: 'border-l-4 border-l-yellow-500',
  purple: 'border-l-4 border-l-purple-500',
  orange: 'border-l-4 border-l-orange-500',
  gray: 'border-l-4 border-l-gray-500',
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
  green: 'text-success',
  blue: 'text-primary',
  red: 'text-destructive',
  yellow: 'text-yellow-600',
  purple: 'text-purple-600',
  orange: 'text-orange-600',
  gray: 'text-muted-foreground',
  indigo: 'text-indigo-600',
  pink: 'text-pink-600',
};

// Icon size class mapping
const iconSizeClasses: Record<string, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

// Status class mapping
const statusClasses: Record<string, string> = {
  success: 'bg-success-light border-success-light',
  warning: 'bg-yellow-50 border-yellow-200',
  error: 'bg-destructive border-destructive',
  info: 'bg-primary border-primary',
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
  iconColor = 'blue',
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
}: CardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Build base classes
  const baseClasses = [
    variantClasses[variant],
    paddingClasses[padding],
    borderAccentClasses[borderAccent],
    overflow !== 'visible' ? `overflow-${overflow}` : '',
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
      className={`${baseClasses} ${className}`}
      style={style}
      onClick={clickable || onClick ? handleClick : undefined}
    >
      {/* Header Section */}
      {(title || subtitle || description || Icon || actionButton || status) && (
        <div className={`${headerClassName}`}>
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
