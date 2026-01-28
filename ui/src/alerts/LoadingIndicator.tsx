import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
  className?: string;
  showMessage?: boolean;
}

export default function LoadingIndicator({
  message = 'Loading...',
  className = '',
  showMessage = false,
}: LoadingIndicatorProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className={`fixed bottom-4 right-4 z-50 bg-card border border-border rounded-lg shadow-lg px-4 py-3 flex items-center space-x-3 animate-in slide-in-from-bottom-2 fade-in duration-300 ${className}`}
    >
      {/* Spinner */}
      <div className="relative" aria-hidden="true">
        <div className="w-5 h-5 border-2 border-border rounded-full"></div>
        <div className="absolute top-0 left-0 w-5 h-5 border-2 border-transparent border-t-primary rounded-full animate-spin"></div>
      </div>

      {/* Message */}
      {showMessage && (
        <span
          className="text-sm font-medium text-foreground"
          aria-live="polite"
        >
          {message}
        </span>
      )}
    </div>
  );
}

// Alternative minimal version for smaller spaces
export function MinimalLoadingIndicator({
  message = 'Loading...',
  className = '',
  showMessage = false,
}: LoadingIndicatorProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className={`fixed bottom-4 right-4 z-50 bg-card border border-border rounded-full shadow-lg p-3 flex items-center space-x-2 animate-in slide-in-from-bottom-2 fade-in duration-300 ${className}`}
    >
      {/* Spinner */}
      <div
        className="w-4 h-4 border-2 border-border border-t-primary-600 rounded-full animate-spin"
        aria-hidden="true"
      ></div>

      {/* Message */}
      {showMessage && (
        <span
          className="text-xs font-medium text-foreground"
          aria-live="polite"
        >
          {message}
        </span>
      )}
    </div>
  );
}

// Inline loading indicator for simple loading states
export function InlineLoadingIndicator({
  message = 'Loading...',
  className = '',
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className={`flex items-center justify-center space-x-2 py-8 ${className}`}
    >
      {/* Spinner */}
      <div
        className="w-4 h-4 border-2 border-border border-t-primary-600 rounded-full animate-spin"
        aria-hidden="true"
      ></div>

      {/* Message */}
      <span className="text-sm text-muted-foreground" aria-live="polite">
        {message}
      </span>
    </div>
  );
}
