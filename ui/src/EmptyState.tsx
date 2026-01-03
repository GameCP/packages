'use client';

import React from 'react';
import { IconType } from 'react-icons';

interface EmptyStateProps {
  icon: IconType;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  subtitle,
  action,
  className = '',
}) => {
  return (
    <div
      className={`text-center py-12 text-secondary-foreground p-6 lg:p-12 ${className}`}
      role="status"
      aria-live="polite"
    >
      <Icon
        className="w-12 h-12 mx-auto mb-3 text-muted-foreground"
        aria-hidden="true"
      />
      <p className="text-sm font-medium mb-1">{title}</p>
      <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
};

export default EmptyState;
