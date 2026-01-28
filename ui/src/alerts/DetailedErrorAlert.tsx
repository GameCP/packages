'use client';

import React from 'react';
import ErrorMessage from './ErrorMessage';
import type { ErrorDetails } from '@/lib/errorUtils';

interface DetailedErrorAlertProps {
  error: ErrorDetails | null;
  onDismiss?: () => void;
  dismissible?: boolean;
  className?: string;
}

export default function DetailedErrorAlert({
  error,
  onDismiss,
  dismissible = true,
  className = '',
}: DetailedErrorAlertProps) {
  if (!error) return null;

  return (
    <ErrorMessage
      message={
        <div className="flex-1">
          <div className="font-medium">{error.message}</div>
          {error.details && (
            <div className="text-sm opacity-90 mt-1">{error.details}</div>
          )}
          {error.contextInfo && (
            <div className="text-xs opacity-75 mt-2">
              Context: {error.contextInfo}
            </div>
          )}
          <div className="text-xs opacity-75 mt-1">{error.timestamp}</div>
          {error.statusCode && (
            <div className="text-xs opacity-75">
              HTTP Status: {error.statusCode}
            </div>
          )}
        </div>
      }
      type="error"
      dismissible={dismissible}
      onDismiss={onDismiss}
      className={className}
    />
  );
}

// Convenience variants for common error types
export function NetworkErrorAlert({
  onDismiss,
  className = '',
}: Omit<DetailedErrorAlertProps, 'error'>) {
  const error: ErrorDetails = {
    message: 'Network connection error',
    details:
      'Unable to connect to the server. Check your internet connection and try again.',
    timestamp: new Date().toLocaleTimeString(),
  };
  return (
    <DetailedErrorAlert
      error={error}
      onDismiss={onDismiss}
      dismissible
      className={className}
    />
  );
}

export function TimeoutErrorAlert({
  onDismiss,
  className = '',
}: Omit<DetailedErrorAlertProps, 'error'>) {
  const error: ErrorDetails = {
    message: 'Request timeout',
    details: 'The request took too long to complete. Please try again.',
    timestamp: new Date().toLocaleTimeString(),
  };
  return (
    <DetailedErrorAlert
      error={error}
      onDismiss={onDismiss}
      dismissible
      className={className}
    />
  );
}

export function ServerErrorAlert({
  statusCode,
  onDismiss,
  className = '',
}: Omit<DetailedErrorAlertProps, 'error'> & { statusCode?: number }) {
  const error: ErrorDetails = {
    message: `Server error: HTTP ${statusCode || 500}`,
    details:
      statusCode === 404
        ? 'The requested resource was not found.'
        : statusCode === 403
          ? 'You do not have permission to access this resource.'
          : 'The server encountered an error processing your request.',
    timestamp: new Date().toLocaleTimeString(),
    statusCode,
  };
  return (
    <DetailedErrorAlert
      error={error}
      onDismiss={onDismiss}
      dismissible
      className={className}
    />
  );
}
