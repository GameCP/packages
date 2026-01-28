'use client';

import React from 'react';
import {
  RiErrorWarningLine,
  RiInformationLine,
  RiCheckLine,
  RiCloseLine,
} from 'react-icons/ri';
import LoadingButton from '../buttons/LoadingButton';

interface ErrorMessageProps {
  message: string | React.ReactNode;
  type?: 'error' | 'warning' | 'success' | 'info' | 'unsaved';
  className?: string;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  /** Action button configuration for unsaved type */
  actionButton?: {
    text: string;
    loadingText?: string;
    isLoading?: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

export default function ErrorMessage({
  message,
  type = 'error',
  className = '',
  icon,
  dismissible = false,
  onDismiss,
  actionButton,
}: ErrorMessageProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return 'alert-danger';
      case 'warning':
        return 'alert-warning';
      case 'success':
        return 'alert-success';
      case 'info':
        return 'alert-info';
      case 'unsaved':
        return 'alert-unsaved';
      default:
        return 'alert-danger';
    }
  };

  const getDefaultIcon = () => {
    switch (type) {
      case 'error':
        return <RiErrorWarningLine className="w-8 h-8 mr-2 flex-shrink-0" />;
      case 'warning':
        return <RiErrorWarningLine className="w-8 h-8 mr-2 flex-shrink-0" />;
      case 'success':
        return <RiCheckLine className="w-8 h-8 mr-2 flex-shrink-0" />;
      case 'info':
        return <RiInformationLine className="w-8 h-8 mr-2 flex-shrink-0" />;
      case 'unsaved':
        return <RiInformationLine className="w-8 h-8 mr-2 flex-shrink-0" />;
      default:
        return <RiErrorWarningLine className="w-8 h-8 mr-2 flex-shrink-0" />;
    }
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`alert flex gap-2 items-center border ${getTypeStyles()} ${className}`}
    >
      <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
        {icon || getDefaultIcon()}
      </div>
      <div className="break-words flex-1 font-normal">{message}</div>
      {actionButton && (
        <div className="flex-shrink-0 ml-2">
          <LoadingButton
            onClick={actionButton.onClick}
            isLoading={actionButton.isLoading || false}
            loadingText={actionButton.loadingText}
            icon={actionButton.icon as any}
            variant="primary"
            size="sm"
          >
            {actionButton.text}
          </LoadingButton>
        </div>
      )}
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-2 flex-shrink-0 text-current opacity-70 hover:opacity-100"
          aria-label="Dismiss message"
        >
          <RiCloseLine className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// Convenience components for common use cases
export function ErrorAlert({
  message,
  className = '',
  dismissible = false,
  onDismiss,
}: Omit<ErrorMessageProps, 'type'>) {
  return (
    <ErrorMessage
      message={message}
      type="error"
      className={className}
      dismissible={dismissible}
      onDismiss={onDismiss}
    />
  );
}

export function SuccessAlert({
  message,
  className = '',
  dismissible = false,
  onDismiss,
}: Omit<ErrorMessageProps, 'type'>) {
  return (
    <ErrorMessage
      message={message}
      type="success"
      className={className}
      dismissible={dismissible}
      onDismiss={onDismiss}
    />
  );
}

export function WarningAlert({
  message,
  className = '',
  dismissible = false,
  onDismiss,
}: Omit<ErrorMessageProps, 'type'>) {
  return (
    <ErrorMessage
      message={message}
      type="warning"
      className={className}
      dismissible={dismissible}
      onDismiss={onDismiss}
    />
  );
}

export function InfoAlert({
  message,
  className = '',
  dismissible = false,
  onDismiss,
  icon,
}: Omit<ErrorMessageProps, 'type'>) {
  return (
    <ErrorMessage
      message={message}
      type="info"
      className={className}
      dismissible={dismissible}
      onDismiss={onDismiss}
      icon={icon}
    />
  );
}

export function UnsavedAlert({
  message,
  className = '',
  actionButton,
}: Omit<ErrorMessageProps, 'type' | 'dismissible' | 'onDismiss'>) {
  return (
    <ErrorMessage
      message={message}
      type="unsaved"
      className={className}
      actionButton={actionButton}
    />
  );
}
