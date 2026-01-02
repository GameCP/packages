import React from 'react';
import { IconType } from 'react-icons';

interface PageHeaderProps {
  icon?: IconType;
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  icon: Icon,
  title,
  subtitle,
  rightContent,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`mb-6 lg:mb-8 ${className}`}>
      <div className="header-layout">
        <div className="flex items-center space-x-3">
          {Icon && <Icon className="w-6 h-6 lg:w-8 lg:h-8 flex-shrink-0" />}
          <div className="min-w-0">
            <h1 className="text-xl lg:text-3xl font-bold text-foreground  truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm lg:text-base text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {rightContent && (
          <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
}
