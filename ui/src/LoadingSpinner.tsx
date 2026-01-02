'use client';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
  showMessage?: boolean;
}

const LoadingSpinner = ({
  message = 'Initializing...',
  className,
  showMessage = false,
}: LoadingSpinnerProps) => {
  // Use provided className or default to full viewport height container with centering
  const containerClasses =
    className !== undefined
      ? className
      : 'flex items-center justify-center h-screen min-h-screen';

  return (
    <div
      className={containerClasses}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="text-center">
        {/* Scale loader */}
        <div
          className="flex items-center justify-center space-x-2 mb-6"
          aria-hidden="true"
        >
          <div className="w-1.5 h-12 bg-gradient-to-t from-primary-600 to-primary-400 rounded-full shadow-sm [animation:wave_1.2s_ease-in-out_infinite] [animation-delay:0s]"></div>
          <div className="w-1.5 h-8 bg-gradient-to-t from-primary-600 to-primary-400 rounded-full shadow-sm [animation:wave_1.2s_ease-in-out_infinite] [animation-delay:0.2s]"></div>
          <div className="w-1.5 h-8 bg-gradient-to-t from-primary-600 to-primary-400 rounded-full shadow-sm [animation:wave_1.2s_ease-in-out_infinite] [animation-delay:0.4s]"></div>
          <div className="w-1.5 h-12 bg-gradient-to-t from-primary-600 to-primary-400 rounded-full shadow-sm [animation:wave_1.2s_ease-in-out_infinite] [animation-delay:0.6s]"></div>
        </div>

        {/* Loading text */}
        {showMessage && (
          <div className="space-y-2">
            <p
              className="text-sm text-secondary-foreground animate-pulse"
              aria-live="polite"
            >
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
