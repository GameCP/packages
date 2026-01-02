'use client';

import React, { useState } from 'react';
import {
  RiEyeLine,
  RiEyeOffLine,
  RiCloseLine,
  RiRefreshLine,
  RiFileCopyLine,
  RiCheckLine,
} from 'react-icons/ri';


type IconConfig =
  | React.ReactNode
  | { left?: React.ReactNode; right?: React.ReactNode };

interface FormInputProps {
  label: string;
  name: string;
  type?:
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'checkbox'
  | 'textarea'
  | 'color';
  value: string | number | boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string | React.ReactNode;
  className?: string;
  inputClassName?: string;
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;
  autoComplete?: string;
  description?: string | React.ReactNode;
  footerDescription?: string | React.ReactNode;
  autoFocus?: boolean;
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  // Icon props
  icon?: IconConfig;
  // Textarea-specific props
  rows?: number;
  // Password-specific props
  showHidePassword?: boolean;
  onGeneratePassword?: () => void;
  // Copy to clipboard
  copyable?: boolean;
  // Read-only display (no onChange required)
  readOnly?: boolean;
  // Clearable
  clearable?: boolean;
}

export default function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  className = '',
  inputClassName = '',
  min,
  max,
  step,
  maxLength,
  autoComplete,
  description,
  footerDescription,
  autoFocus = false,
  onKeyDown,
  onBlur,
  icon,
  rows = 3,
  showHidePassword = false,
  onGeneratePassword,
  copyable = false,
  readOnly = false,
  clearable = true,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Helper function to determine if icons should be shown for this input type
  const shouldShowIcons = (inputType: string) => {
    return inputType !== 'checkbox' && inputType !== 'textarea';
  };

  // Helper function to get icon configuration
  const getIconConfig = (
    iconProp: IconConfig | undefined
  ): { left: React.ReactNode; right: React.ReactNode } => {
    if (!iconProp) return { left: null, right: null };

    // If it's a React element (like <RiUserLine />), treat it as a left icon
    if (React.isValidElement(iconProp)) {
      return { left: iconProp, right: null };
    }

    // If it's an object with left/right properties
    if (
      typeof iconProp === 'object' &&
      iconProp !== null &&
      ('left' in iconProp || 'right' in iconProp)
    ) {
      return { left: iconProp.left || null, right: iconProp.right || null };
    }

    // Fallback: treat as left icon (but only if it's a valid ReactNode)
    return {
      left: React.isValidElement(iconProp) ? iconProp : null,
      right: null,
    };
  };

  // Helper function to render icon
  const renderIcon = (
    iconNode: React.ReactNode,
    position: 'left' | 'right'
  ) => {
    if (!iconNode) return null;

    // For number inputs, move right icons further left to avoid browser arrows
    const rightPositionClass =
      position === 'right' && type === 'number'
        ? 'right-4 pr-3' // Move slightly left for number inputs
        : position === 'right'
          ? 'right-0 pr-3' // Normal position for other inputs
          : 'left-0 pl-3'; // Left position unchanged

    return (
      <div
        className={`absolute inset-y-0 ${rightPositionClass} flex items-center pointer-events-none`}
      >
        <div className="text-muted-foreground">{iconNode}</div>
      </div>
    );
  };

  // Helper function to get input padding classes based on icons
  const getInputPaddingClasses = (
    inputType: string,
    iconConfig: { left: any; right: any }
  ) => {
    if (!shouldShowIcons(inputType)) return '';

    const paddingClasses = [];
    if (iconConfig.left) paddingClasses.push('pl-10');
    if (iconConfig.right) {
      // For number inputs, add extra padding to account for moved icon
      paddingClasses.push(inputType === 'number' ? 'pr-12' : 'pr-10');
    }

    return paddingClasses.join(' ');
  };

  return (
    <div className={`form-group ${className}`}>
      {type === 'checkbox' ? (
        <div className="flex items-center p-2 space-x-3 h-full">
          {/* Visually hidden but accessible checkbox for form submission and accessibility */}
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={Boolean(value)}
            onChange={e => {
              // Update the visual state immediately
              const newValue = e.target.checked;
              // Create a synthetic event that matches what the parent expects
              const syntheticEvent = {
                target: {
                  name: e.target.name,
                  value: newValue,
                  checked: newValue,
                },
                currentTarget: {
                  name: e.target.name,
                  value: newValue,
                  checked: newValue,
                },
              } as unknown as React.ChangeEvent<HTMLInputElement>;
              onChange(syntheticEvent);
            }}
            required={required}
            disabled={disabled}
            onKeyDown={onKeyDown}
            className="sr-only"
            aria-label={label}
            aria-describedby={
              error
                ? `${name}-error`
                : description
                  ? `${name}-description`
                  : undefined
            }
            aria-invalid={error ? 'true' : 'false'}
          />

          {/* Custom toggle switch */}
          <button
            type="button"
            onClick={() => {
              if (!disabled) {
                // Trigger the hidden checkbox instead of creating synthetic event
                const checkbox = document.getElementById(
                  name
                ) as HTMLInputElement;
                if (checkbox) {
                  checkbox.click();
                }
              }
            }}
            disabled={disabled}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              ${Boolean(value) ? 'bg-primary' : 'bg-muted'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${error ? 'ring-2 ring-destructive' : ''}
            `}
            aria-label={`${label}${required ? ' (required)' : ''}`}
            aria-describedby={name}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-background border border-border transition duration-200 ease-in-out
                ${Boolean(value) ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>

          {/* Label and description inline */}
          <div className="flex flex-col">
            <label
              htmlFor={name}
              className="text-sm font-medium text-foreground cursor-pointer"
              onClick={() => {
                if (!disabled) {
                  // Trigger the hidden checkbox when label is clicked
                  const checkbox = document.getElementById(
                    name
                  ) as HTMLInputElement;
                  if (checkbox) {
                    checkbox.click();
                  }
                }
              }}
            >
              {label}
              {required && (
                <span className="text-destructive ml-1" aria-label="required">
                  *
                </span>
              )}
            </label>
            {description && (
              <span
                id={`${name}-description`}
                className="text-xs text-muted-foreground"
              >
                {description}
              </span>
            )}
          </div>

          {error && (
            <div id={`${name}-error`} className="form-error" role="alert">
              {typeof error === 'string' ? <p>{error}</p> : error}
            </div>
          )}
        </div>
      ) : (
        <>
          {label && (
            <label htmlFor={name} className="form-label">
              {label}
              {required && <span className="form-label-required">*</span>}
            </label>
          )}
          {description && (
            <p id={`${name}-description`} className="form-description">
              {description}
            </p>
          )}
          {type === 'textarea' ? (
            <textarea
              id={name}
              name={name}
              value={value as string}
              onChange={onChange}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              autoFocus={autoFocus}
              onKeyDown={onKeyDown}
              onBlur={onBlur}
              rows={rows}
              maxLength={maxLength}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={
                error
                  ? `${name}-error`
                  : description
                    ? `${name}-description`
                    : undefined
              }
              className={`form-input ${error ? 'form-input-error' : ''} ${inputClassName}`}
            />
          ) : type === 'color' ? (
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 border border-input rounded-md overflow-hidden bg-card">
                <input
                  id={name}
                  name={name}
                  type="color"
                  value={value as string}
                  onChange={onChange}
                  required={required}
                  disabled={disabled}
                  className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                />
                <div
                  className="w-full h-full rounded-md"
                  style={{ backgroundColor: value as string }}
                />
              </div>

              <div className="relative">
                <input
                  id={`${name}-text`}
                  name={`${name}-text`}
                  type="text"
                  value={value as string}
                  onChange={onChange}
                  placeholder={placeholder}
                  required={required}
                  disabled={disabled}
                  maxLength={maxLength}
                  autoComplete={autoComplete}
                  autoFocus={autoFocus}
                  onKeyDown={onKeyDown}
                  onBlur={onBlur}
                  className={`form-input max-w-24 ${error ? 'form-input-error' : ''} ${getInputPaddingClasses(type, getIconConfig(icon))} ${inputClassName}`}
                  aria-label={`${label} text input`}
                />
                {shouldShowIcons(type) &&
                  (() => {
                    const iconConfig = getIconConfig(icon);
                    return (
                      <>
                        {renderIcon(iconConfig.left, 'left')}
                        {renderIcon(iconConfig.right, 'right')}
                      </>
                    );
                  })()}
              </div>
            </div>
          ) : showHidePassword && type === 'password' ? (
            <div className="relative">
              <input
                id={name}
                name={name}
                type={showPassword ? 'text' : 'password'}
                value={value as string | number}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled || readOnly}
                readOnly={readOnly}
                maxLength={maxLength}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={
                  error
                    ? `${name}-error`
                    : description
                      ? `${name}-description`
                      : undefined
                }
                className={`form-input ${error ? 'form-input-error' : ''} ${readOnly ? 'bg-muted cursor-default' : ''} ${copyable ? 'pr-20' : 'pr-10'} ${getInputPaddingClasses(type, getIconConfig(icon))} ${inputClassName}`}
              />
              {shouldShowIcons(type) &&
                (() => {
                  const iconConfig = getIconConfig(icon);
                  return (
                    <>
                      {renderIcon(iconConfig.left, 'left')}
                      {renderIcon(iconConfig.right, 'right')}
                    </>
                  );
                })()}
              {/* Copy button for password */}
              {copyable && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="absolute inset-y-0 right-8 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors duration-200 z-10"
                  aria-label={`Copy ${label}`}
                  title={copied ? 'Copied!' : `Copy ${label}`}
                >
                  {copied ? (
                    <RiCheckLine className="w-4 h-4 text-green-500" aria-hidden="true" />
                  ) : (
                    <RiFileCopyLine className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors duration-200 z-10"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <RiEyeOffLine className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <RiEyeLine className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
              {onGeneratePassword && !readOnly && (
                <button
                  type="button"
                  onClick={onGeneratePassword}
                  className={`absolute inset-y-0 ${copyable ? 'right-16' : 'right-8'} flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors duration-200 z-10`}
                  aria-label="Generate new password"
                  title="Generate new password"
                >
                  <RiRefreshLine className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
          ) : (
            <div className="relative group">
              <input
                id={name}
                name={name}
                type={type}
                value={value as string | number}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled || readOnly}
                readOnly={readOnly}
                min={min}
                max={max}
                step={step}
                maxLength={maxLength}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={
                  error
                    ? `${name}-error`
                    : description
                      ? `${name}-description`
                      : undefined
                }
                className={`form-input ${error ? 'form-input-error' : ''} ${readOnly ? 'bg-muted cursor-default' : ''} ${copyable ? 'pr-10' : ''} ${getInputPaddingClasses(type, getIconConfig(icon))} ${inputClassName}`}
              />
              {shouldShowIcons(type) &&
                (() => {
                  const iconConfig = getIconConfig(icon);
                  return (
                    <>
                      {renderIcon(iconConfig.left, 'left')}
                      {renderIcon(iconConfig.right, 'right')}
                    </>
                  );
                })()}
              {/* Copy button */}
              {copyable && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-all duration-200 z-10`}
                  aria-label={`Copy ${label}`}
                  title={copied ? 'Copied!' : `Copy ${label}`}
                >
                  {copied ? (
                    <RiCheckLine className="w-4 h-4 text-green-500" aria-hidden="true" />
                  ) : (
                    <RiFileCopyLine className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              )}
              {/* Clear button for text inputs */}
              {clearable && !copyable && value !== '' && value !== null && value !== undefined && !disabled && !readOnly && (
                <button
                  type="button"
                  onClick={() => {
                    const syntheticEvent = {
                      target: { name, value: '' },
                    } as React.ChangeEvent<HTMLInputElement>;
                    onChange(syntheticEvent);
                  }}
                  className={`absolute inset-y-0 ${type === 'number' ? 'right-4' : 'right-0'} flex items-center pr-3 text-muted-foreground hover:text-muted-foreground transition-all duration-200 z-10 opacity-0 group-hover:opacity-100`}
                  aria-label={`Clear ${label}`}
                  title={`Clear ${label}`}
                >
                  <RiCloseLine className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
          )}
          {footerDescription && (
            <p className="text-xs mt-1">{footerDescription}</p>
          )}
          {error && (
            <div id={`${name}-error`} className="form-error" role="alert">
              {typeof error === 'string' ? <p>{error}</p> : error}
            </div>
          )}
        </>
      )}
    </div>
  );
}
