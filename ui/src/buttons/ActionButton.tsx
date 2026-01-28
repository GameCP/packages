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
  icon?: React.ComponentType<{
    className?: string;
    size?: number;
    style?: React.CSSProperties;
  }>;
  label?: string;
  onClick?: () => void | Promise<any>;
  href?: string;
  disabled?: boolean;
  loading?: boolean; // External loading state
  loadingIcon?: React.ComponentType<{
    className?: string;
    size?: number;
    style?: React.CSSProperties;
  }>; // Custom loading icon
  disableLoadingSpin?: boolean; // Disable spin animation for custom loading icons
  size?: 'xs' | 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  className?: string;
  title?: string;
  tooltipId?: string; // Unique ID for tooltip
  tooltipContent?: string; // Content for the tooltip (uses data-tooltip-content attribute with shared global tooltip)
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
  | 'clone'
  | 'input';
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
  tooltipContent,
  tooltipPlace = 'bottom',
  tooltipOffset = 6,
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
    xs: terminalMode ? 'w-3 h-3' : 'w-3 h-3',
    sm: terminalMode ? 'w-4 h-4' : 'w-4 h-4',
    md: terminalMode ? 'w-4 h-4' : 'w-4 h-4',
    lg: terminalMode ? 'w-5 h-5' : 'w-5 h-5',
  };

  // Numerical sizes for React Icons 'size' prop to ensure they actually scale
  const iconPixelSizes = {
    xs: 9, // Truly tiny for xs
    sm: 16,
    md: 16,
    lg: 20,
  };

  // Consistent height classes matching the global button system
  const heightClasses = {
    xs: terminalMode ? '' : 'btn-xs',
    sm: terminalMode ? '' : 'btn-sm',
    md: terminalMode ? '' : 'btn-md',
    lg: terminalMode ? '' : 'btn-lg',
  };

  // Size-aware padding classes for icon-only buttons
  const paddingClasses = iconOnly
    ? terminalMode
      ? ''
      : size === 'xs'
        ? 'p-1.5'
        : 'p-2'
    : 'px-3 py-1.5';

  // Static translations
  const t = {
    edit: 'Edit',
    delete: 'Delete',
    deactivate: 'Deactivate',
    activate: 'Activate',
    view: 'View',
    metrics: 'Metrics',
    start: 'Start',
    stop: 'Stop',
    restart: 'Restart',
    pause: 'Pause',
    clone: 'Clone',
  };

  const getVariantConfig = () => {
    switch (variant) {
      case 'edit':
        return {
          icon: fill ? RiEditFill : RiEditLine,
          label: t.edit,
          className: 'action-btn-edit',
        };
      case 'delete':
        return {
          icon: fill ? RiDeleteBinFill : RiDeleteBinLine,
          label: t.delete,
          className: 'action-btn-delete',
        };
      case 'deactivate':
        return {
          icon: fill ? RiStopCircleFill : RiStopCircleLine,
          label: t.deactivate,
          className: 'action-btn-deactivate',
        };
      case 'activate':
        return {
          icon: fill ? RiPlayCircleFill : RiPlayCircleLine,
          label: t.activate,
          className: 'action-btn-activate',
        };
      case 'view':
        return {
          icon: fill ? RiEyeFill : RiEyeLine,
          label: t.view,
          className: 'action-btn-view',
        };
      case 'metrics':
        return {
          icon: fill ? RiBarChartFill : RiBarChartLine,
          label: t.metrics,
          className: 'action-btn-metrics',
        };
      case 'start':
        return {
          icon: fill ? RiPlayFill : RiPlayLine,
          label: t.start,
          className: 'action-btn-start',
        };
      case 'stop':
        return {
          icon: fill ? RiStopFill : RiStopLine,
          label: t.stop,
          className: 'action-btn-stop',
        };
      case 'restart':
        return {
          icon: fill ? RiRestartFill : RiRestartLine,
          label: t.restart,
          className: 'action-btn-restart',
        };
      case 'pause':
        return {
          icon: fill ? RiPauseFill : RiPauseLine,
          label: t.pause,
          className: 'action-btn-pause',
        };
      case 'clone':
        return {
          icon: fill ? RiFileCopyFill : RiFileCopyLine,
          label: t.clone,
          className: 'action-btn-clone',
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
    success: 'action-btn-start',
    warning: 'action-btn-pause',
    info: 'action-btn-info',
    metrics: 'action-btn-metrics',
    input: 'action-btn-input',
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
        (IconComponent || variantConfig?.icon) && (
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: iconPixelSizes[size],
              height: iconPixelSizes[size],
            }}
            aria-hidden="true"
          >
            {IconComponent ? (
              <IconComponent
                size={iconPixelSizes[size]}
                style={{
                  width: iconPixelSizes[size],
                  height: iconPixelSizes[size],
                }}
                aria-hidden="true"
              />
            ) : variantConfig ? (
              <variantConfig.icon
                size={iconPixelSizes[size]}
                style={{
                  width: iconPixelSizes[size],
                  height: iconPixelSizes[size],
                }}
                aria-hidden="true"
              />
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
  // If tooltipContent is provided, use that; otherwise derive from title/label for backward compat
  const derivedTooltipContent =
    tooltipContent || title || (iconOnly ? variantConfig?.label || label : undefined);

  const buttonClassName = `
    ${terminalMode
      ? 'btn-terminal'
      : variant === 'input'
        ? `action-btn-input ${paddingClasses} ${className} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`
        : `btn ${variantClass} ${paddingClasses} ${heightClasses[size]}  ${className} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`
    }`;

  // Render as Link if href is provided
  if (href) {
    return (
      <>
        <Link
          href={href}
          scroll={false}
          // Only pass title if no tooltipId is provided (to avoid double tooltips)
          title={!tooltipId && typeof title === 'string' ? title : undefined}
          aria-label={
            iconOnly
              ? typeof buttonAriaLabel === 'string'
                ? buttonAriaLabel
                : undefined
              : undefined
          }
          onClick={handleClick}
          className={buttonClassName}
          data-tooltip-id={tooltipId || (tooltipContent ? 'global-tooltip' : undefined)}
          data-tooltip-content={tooltipContent || undefined}
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
            {derivedTooltipContent}
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
        // Only pass title if no tooltipId is provided (to avoid double tooltips)
        title={!tooltipId && typeof title === 'string' ? title : undefined}
        aria-label={
          iconOnly
            ? typeof buttonAriaLabel === 'string'
              ? buttonAriaLabel
              : undefined
            : undefined
        }
        className={buttonClassName}
        data-tooltip-id={tooltipId || (tooltipContent ? 'global-tooltip' : undefined)}
        data-tooltip-content={tooltipContent || undefined}
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
          {derivedTooltipContent}
        </SharedTooltip>
      )}
    </>
  );
}
