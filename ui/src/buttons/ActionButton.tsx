'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import SharedTooltip from '../SharedTooltip';
import {
  RiEditLine,
  RiEditFill,
  RiDeleteBinLine,
  RiDeleteBinFill,
  RiStopCircleLine,
  RiStopCircleFill,
  RiPlayCircleLine,
  RiPlayCircleFill,
  RiEyeLine,
  RiEyeFill,
  RiBarChartLine,
  RiBarChartFill,
  RiPlayLine,
  RiPlayFill,
  RiStopLine,
  RiStopFill,
  RiRestartLine,
  RiRestartFill,
  RiPauseLine,
  RiPauseFill,
  RiFileCopyLine,
  RiFileCopyFill,
} from 'react-icons/ri';

export interface ActionButtonProps {
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
  onClick?: () => void | Promise<void>;
  href?: string;
  disabled?: boolean;
  loading?: boolean; // External loading state
  loadingIcon?: React.ComponentType<{ className?: string }>; // Custom loading icon
  disableLoadingSpin?: boolean; // Disable spin animation for custom loading icons
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  className?: string;
  title?: string;
  tooltipId?: string; // Unique ID for tooltip
  tooltipPlace?: 'top' | 'bottom' | 'left' | 'right';
  tooltipOffset?: number;
  tooltipDelayShow?: number;
  tooltipDelayHide?: number;
  type?: 'button' | 'submit' | 'reset';
  variant?:
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info'
  | 'edit'
  | 'delete'
  | 'deactivate'
  | 'activate'
  | 'view'
  | 'metrics'
  | 'start'
  | 'stop'
  | 'restart'
  | 'pause'
  | 'clone';
  terminalMode?: boolean; // Special prop for terminal styling
  fill?: boolean; // Use filled icons instead of outlined
  [key: string]: any; // Allow additional props to be passed through
}

export default function ActionButton({
  icon: IconComponent,
  label,
  onClick,
  href,
  disabled = false,
  size = 'md',
  iconOnly = false,
  className = '',
  title,
  tooltipId,
  tooltipPlace = 'bottom',
  tooltipOffset = 12,
  tooltipDelayShow = 200,
  tooltipDelayHide = 100,
  type = 'button',
  variant,
  terminalMode = false,
  fill = false,
  loading: externalLoading, // Extract loading prop to prevent it from being passed to DOM
  loadingIcon: LoadingIconComponent, // Custom loading icon
  disableLoadingSpin = false, // Disable spin animation for custom loading icons
  ...restProps
}: ActionButtonProps) {
  // Internal loading state for instant feedback
  const [loading, setLoading] = useState(false);

  // Handle click with instant loading feedback
  const handleClick = useCallback(async () => {
    if (onClick && !disabled && !loading) {
      // Set loading immediately for instant visual feedback
      setLoading(true);
      try {
        await onClick();
      } catch (error) {
        console.error('ActionButton onClick error:', error);
      } finally {
        // Always clear loading state when action completes
        setLoading(false);
      }
    }
  }, [onClick, disabled, loading]);

  const iconSizes = {
    sm: terminalMode ? 'w-4 h-4' : 'w-4 h-4',
    md: terminalMode ? 'w-4 h-4' : 'w-4 h-4',
    lg: terminalMode ? 'w-5 h-5' : 'w-5 h-5',
  };

  // Consistent height classes matching the global button system
  const heightClasses = {
    sm: terminalMode ? '' : 'btn-sm',
    md: terminalMode ? '' : 'btn-md',
    lg: terminalMode ? '' : 'btn-lg',
  };

  const paddingClasses = iconOnly ? (terminalMode ? '' : 'p-2') : 'px-3 py-1.5';

  const getVariantConfig = () => {
    switch (variant) {
      case 'edit':
        return {
          icon: fill ? RiEditFill : RiEditLine,
          label: 'Edit',
          className: 'btn-secondary',
        };
      case 'delete':
        return {
          icon: fill ? RiDeleteBinFill : RiDeleteBinLine,
          label: 'Delete',
          className: 'btn-danger',
        };
      case 'deactivate':
        return {
          icon: fill ? RiStopCircleFill : RiStopCircleLine,
          label: 'Deactivate',
          className:
            'bg-slate-50  text-slate-600 hover:bg-slate-100 hover:text-slate-700 border border-slate-200 transition-all duration-300 ease-in-out',
        };
      case 'activate':
        return {
          icon: fill ? RiPlayCircleFill : RiPlayCircleLine,
          label: 'Activate',
          className:
            'bg-emerald/10  text-emerald hover:bg-emerald/20 hover:text-emerald-700 border border-emerald-200 transition-all duration-300 ease-in-out',
        };
      case 'view':
        return {
          icon: fill ? RiEyeFill : RiEyeLine,
          label: 'View',
          className:
            'bg-muted  text-muted-foreground hover:bg-muted hover:text-foreground border border-border transition-all duration-300 ease-in-out',
        };
      case 'metrics':
        return {
          icon: fill ? RiBarChartFill : RiBarChartLine,
          label: 'Metrics',
          className:
            'bg-purple/10  text-purple-600 hover:bg-purple-100 hover:text-purple-700 border border-purple-200 transition-all duration-300 ease-in-out',
        };
      case 'start':
        return {
          icon: fill ? RiPlayFill : RiPlayLine,
          label: 'Start',
          className:
            'bg-success/10 text-success hover:bg-success/20 hover:text-success border border-success transition-all duration-300 ease-in-out',
        };
      case 'stop':
        return {
          icon: fill ? RiStopFill : RiStopLine,
          label: 'Stop',
          className:
            'bg-danger/10 text-danger hover:bg-danger/20 hover:text-danger border border-danger transition-all duration-300 ease-in-out',
        };
      case 'restart':
        return {
          icon: fill ? RiRestartFill : RiRestartLine,
          label: 'Restart',
          className:
            'bg-orange/10  text-orange hover:bg-orange/20 hover:text-orange-700 border border-orange/30 transition-all duration-300 ease-in-out',
        };
      case 'pause':
        return {
          icon: fill ? RiPauseFill : RiPauseLine,
          label: 'Pause',
          className:
            'bg-amber/10 text-amber hover:bg-amber/20 hover:text-amber border border-amber transition-all duration-300 ease-in-out',
        };
      case 'clone':
        return {
          icon: fill ? RiFileCopyFill : RiFileCopyLine,
          label: 'Clone',
          className:
            'bg-indigo/10  text-indigo hover:bg-indigo/20 hover:text-indigo-700 border border-indigo-200 transition-all duration-300 ease-in-out',
        };
      default:
        return null;
    }
  };

  const variantConfig = getVariantConfig();
  const variantClasses: Record<string, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    success:
      'bg-success/10 text-success hover:bg-success/20 hover:text-success border border-success transition-all duration-300 ease-in-out',
    warning:
      'bg-amber/10 text-amber hover:bg-amber/20 hover:text-amber border border-amber transition-all duration-300 ease-in-out',
    info: 'bg-muted  text-muted-foreground hover:bg-primary hover:text-primary-foreground border border-ring transition-all duration-300 ease-in-out',
    metrics:
      'bg-purple/10  text-purple-600 hover:bg-purple-100 hover:text-purple-700 border border-purple-200 transition-all duration-300 ease-in-out',
  };

  let variantClass = variantConfig
    ? variantConfig.className
    : variant
      ? variantClasses[variant]
      : '';

  // Apply terminal mode styling - remove background/border, change text to gray, keep hover colors
  if (terminalMode && variantClass) {
    // Extract the hover color from the original variant class
    const hoverMatch = variantClass.match(/hover:text-(\w+)-(\d+)/);
    const hoverColor = hoverMatch
      ? `hover:text-${hoverMatch[1]}-${hoverMatch[2]}`
      : 'hover:text-muted-foreground';

    // Replace the variant class with terminal styling
    variantClass = `text-muted-foreground ${hoverColor} transition-colors duration-200`;
  }
  const isDisabled = disabled || loading || externalLoading;

  const buttonContent = (
    <>
      {loading || externalLoading ? (
        <div
          className={`${iconSizes[size]} flex items-center justify-center flex-shrink-0 ${terminalMode ? 'text-muted-foreground p-0.5' : ''}`}
          aria-hidden="true"
        >
          {LoadingIconComponent ? (
            <LoadingIconComponent
              className={`w-full h-full ${disableLoadingSpin ? '' : 'animate-spin-slow'}`}
              aria-hidden="true"
            />
          ) : (
            <div
              className="w-full h-full border-2 border-current border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            ></div>
          )}
        </div>
      ) : (
        (variantConfig?.icon || IconComponent) && (
          <div
            className={`${iconSizes[size]} flex items-center justify-center flex-shrink-0`}
            aria-hidden="true"
          >
            {variantConfig?.icon ? (
              <variantConfig.icon
                className="w-full h-full"
                aria-hidden="true"
              />
            ) : IconComponent ? (
              <IconComponent className="w-full h-full" aria-hidden="true" />
            ) : null}
          </div>
        )
      )}
      {!iconOnly &&
        (restProps.children
          ? restProps.children
          : (variantConfig?.label || label) && (
            <span className="flex items-center">
              {variantConfig?.label || label}
            </span>
          ))}
    </>
  );

  // Determine accessible label
  const accessibleLabel =
    title || (iconOnly ? variantConfig?.label || label : undefined);
  const buttonAriaLabel =
    iconOnly && !accessibleLabel
      ? variantConfig?.label || label || 'Action button'
      : accessibleLabel;

  // Tooltip content can be ReactNode or string
  const tooltipContent = title || (iconOnly ? variantConfig?.label || label : undefined);

  const buttonClassName = `

    ${terminalMode
      ? 'btn-terminal'
      : `btn ${variantClass} ${paddingClasses} ${heightClasses[size]}  ${className} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`
    }`;

  // Render as Link if href is provided
  if (href) {
    return (
      <>
        <Link
          href={href}
          // Only pass title if it's a string, otherwise rely on the tooltip content
          title={typeof title === 'string' ? title : undefined}
          aria-label={iconOnly ? typeof buttonAriaLabel === 'string' ? buttonAriaLabel : undefined : undefined}
          onClick={handleClick}
          className={buttonClassName}
          data-tooltip-id={tooltipId}
          aria-busy={loading || externalLoading ? 'true' : undefined}
          {...restProps}
        >
          {buttonContent}
        </Link>
        {tooltipId && (
          <SharedTooltip
            id={tooltipId}
            place={tooltipPlace}
            offset={tooltipOffset}
            delayShow={tooltipDelayShow}
            delayHide={tooltipDelayHide}
          >
            {tooltipContent}
          </SharedTooltip>
        )}
      </>
    );
  }

  // Otherwise render as button
  return (
    <>
      <button
        type={type}
        onClick={handleClick}
        // Only pass title if it's a string, otherwise rely on the tooltip component
        title={typeof title === 'string' ? title : undefined}
        aria-label={iconOnly ? typeof buttonAriaLabel === 'string' ? buttonAriaLabel : undefined : undefined}
        className={buttonClassName}
        data-tooltip-id={tooltipId}
        aria-busy={loading || externalLoading ? 'true' : undefined}
        {...restProps}
        disabled={isDisabled}
      >
        {buttonContent}
      </button>
      {tooltipId && (
        <SharedTooltip
          id={tooltipId}
          place={tooltipPlace}
          offset={tooltipOffset}
          delayShow={tooltipDelayShow}
          delayHide={tooltipDelayHide}
        >
          {tooltipContent}
        </SharedTooltip>
      )}
    </>
  );
}
