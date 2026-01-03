'use client';

import { ReactNode } from 'react';
import { SkeletonTable } from './Skeleton';
import Spinner from './Spinner';

interface DataTableProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  stickyActions?: boolean;
}

interface DataTableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface DataTableBodyProps {
  children: ReactNode;
  className?: string;
}

interface DataTableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

interface DataTableCellProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  padding?: 'sm' | 'md' | 'lg';
  sticky?: 'left' | 'right';
  stickyOffset?: number;
}

interface DataTableHeaderCellProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  padding?: 'sm' | 'md' | 'lg';
  sticky?: 'left' | 'right';
  stickyOffset?: number;
}

// Main table container
export function DataTable({
  children,
  className = '',
  containerClassName = '',
  stickyActions = false,
}: DataTableProps) {
  return (
    <div className={`card overflow-hidden ${containerClassName}`}>
      <div className="overflow-x-auto">
        <table
          role="table"
          aria-label="Data table"
          className={`w-full divide-y divide-border ${className} ${stickyActions ? 'relative' : ''}`}
        >
          {children}
        </table>
      </div>
    </div>
  );
}

// Table header
export function DataTableHeader({
  children,
  className = '',
}: DataTableHeaderProps) {
  return <thead className={`bg-muted ${className}`}>{children}</thead>;
}

// Table body
export function DataTableBody({
  children,
  className = '',
}: DataTableBodyProps) {
  return <tbody className={`table-body-card ${className}`}>{children}</tbody>;
}

// Table row
export function DataTableRow({
  children,
  className = '',
  onClick,
  hover = true,
}: DataTableRowProps) {
  const baseClasses = 'hover:bg-muted transition-colors duration-150';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  const hoverClasses = hover ? baseClasses : '';

  return (
    <tr
      className={`${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

// Table header cell
export function DataTableHeaderCell({
  children,
  className = '',
  align = 'left',
  padding = 'md',
  sticky,
  stickyOffset = 0,
}: DataTableHeaderCellProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const paddingClasses = {
    sm: 'px-3 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  };

  const stickyClasses = sticky
    ? `sticky ${sticky === 'left' ? 'left-0' : 'right-0'} z-10`
    : '';
  const stickyOffsetClasses =
    sticky && stickyOffset > 0
      ? sticky === 'left'
        ? `left-${stickyOffset}`
        : `right-${stickyOffset}`
      : '';

  // Add visual styling for sticky columns
  const stickyStyling = '';

  return (
    <th
      scope="col"
      className={`${paddingClasses[padding]} ${alignClasses[align]} text-xs font-medium text-muted-foreground uppercase tracking-wider ${stickyClasses} ${stickyOffsetClasses} ${stickyStyling} ${className}`}
    >
      {children}
    </th>
  );
}

// Table cell
export function DataTableCell({
  children,
  className = '',
  align = 'left',
  padding = 'md',
  sticky,
  stickyOffset = 0,
}: DataTableCellProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const paddingClasses = {
    sm: 'px-3 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
  };

  const stickyClasses = sticky
    ? `sticky ${sticky === 'left' ? 'left-0' : 'right-0'} z-10`
    : '';
  const stickyOffsetClasses =
    sticky && stickyOffset > 0
      ? sticky === 'left'
        ? `left-${stickyOffset}`
        : `right-${stickyOffset}`
      : '';

  // Add visual styling for sticky columns
  const stickyStyling = '';

  return (
    <td
      className={`${paddingClasses[padding]} whitespace-nowrap ${alignClasses[align]} text-sm ${stickyClasses} ${stickyOffsetClasses} ${stickyStyling} ${className}`}
    >
      {children}
    </td>
  );
}

// Empty state component
export function DataTableEmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'table',
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: ReactNode;
  variant?: 'table' | 'div';
}) {
  const content = (
    <>
      <Icon className="w-20 h-20 text-primary-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      {action && <div className="flex justify-center">{action}</div>}
    </>
  );

  if (variant === 'div') {
    return (
      <div className="card card-padding text-center lg:p-24">{content}</div>
    );
  }

  return (
    <tr>
      <td colSpan={100} className="px-6 py-12 text-center">
        {content}
      </td>
    </tr>
  );
}

// Loading state component
export function DataTableLoadingState({
  message = 'Loading...',
  rows = 5,
  columns = 4,
}: {
  message?: string;
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="card card-padding">
      <div className="text-center mb-4">
        <Spinner size="md" color="primary" className="mx-auto mb-2" />
        <p className="text-muted-foreground">{message}</p>
      </div>
      <SkeletonTable rows={rows} columns={columns} showHeader={false} />
    </div>
  );
}

// Status badge component
export function StatusBadge({
  status,
  variant = 'default',
}: {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}) {
  const variantClasses = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-success text-success-dark',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-primary-100 text-primary-800',
  };

  return <span className={`badge ${variantClasses[variant]}`}>{status}</span>;
}

// Enhanced actions container with better visual styling
export function DataTableActions({
  children,
  className = '',
  enhanced = false,
}: {
  children: ReactNode;
  className?: string;
  enhanced?: boolean;
}) {
  const baseClasses = 'flex items-center justify-end space-x-2 dt-actions';
  const enhancedClasses = enhanced
    ? 'px-2 py-1 rounded-md bg-card backdrop-blur-sm'
    : '';

  return (
    <div className={`${baseClasses} ${enhancedClasses} ${className}`}>
      {children}
    </div>
  );
}

// Sticky actions column wrapper - use this to wrap your actions column
export function StickyActionsColumn({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-l border-border shadow-[-1px_0_3px_-1px_rgba(0,0,0,0.02)] ${className}`}
    >
      {children}
    </div>
  );
}
