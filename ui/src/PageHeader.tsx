import React from 'react';
import { IconType } from 'react-icons';

export interface PageHeaderProps {
  icon?: IconType;
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PageHeader({
  icon: Icon,
  title,
  subtitle,
  rightContent,
  className = '',
  size = 'lg',
}: PageHeaderProps) {
  const sizeClasses = {
    sm: {
      container: 'mb-6',
      icon: 'w-5 h-5 lg:w-6 lg:h-6',
      title: 'text-lg lg:text-xl',
      subtitle: 'text-sm',
      spacing: 'space-x-2 lg:space-x-3',
    },
    md: {
      container: 'mb-6 lg:mb-8',
      icon: 'w-6 h-6 lg:w-7 lg:h-7',
      title: 'text-xl lg:text-2xl',
      subtitle: 'text-sm',
      spacing: 'space-x-2 lg:space-x-3',
    },
    lg: {
      container: 'mb-6 lg:mb-8',
      icon: 'w-6 h-6 lg:w-8 lg:h-8',
      title: 'text-xl lg:text-3xl',
      subtitle: 'text-sm',
      spacing: 'space-x-2 lg:space-x-3',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`${currentSize.container} ${className}`}>
      <div className="header-layout">
        <div className="flex items-center space-x-3">
          {Icon && <Icon className={`${currentSize.icon} flex-shrink-0`} />}
          <div className="min-w-0">
            <h1 className={`${currentSize.title} font-bold truncate`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`${currentSize.subtitle} text-muted-foreground`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {rightContent && (
          <div
            className={`flex items-center ${currentSize.spacing} flex-shrink-0`}
          >
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
}
