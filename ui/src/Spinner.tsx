import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'blue' | 'white' | 'current';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const colorClasses = {
    primary: 'border-primary-600',
    blue: 'border-ring',
    white: 'border-white',
    current: 'border-current',
  };

  const baseClasses = 'animate-spin rounded-full border-2 border-t-transparent';
  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color];

  const finalClasses =
    `${baseClasses} ${sizeClass} ${colorClass} ${className}`.trim();

  return <div className={finalClasses}></div>;
};

export default Spinner;
