'use client';

import { ReactNode } from 'react';

interface SkeletonProps {
  className?: string;
  children?: ReactNode;
}

interface SkeletonItemProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
  animate?: boolean;
}

interface SkeletonCardProps {
  className?: string;
  children: ReactNode;
}

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
  showHeader?: boolean;
}

interface SkeletonListProps {
  items?: number;
  className?: string;
  itemHeight?: string;
}

interface SkeletonCardsProps {
  items?: number;
  className?: string;
}

// Base skeleton item with pulse animation
export function Skeleton({ className = '', children }: SkeletonProps) {
  return <div className={`animate-pulse ${className}`}>{children}</div>;
}

// Individual skeleton item
export function SkeletonItem({
  className = '',
  width = 'w-full',
  height = 'h-4',
  rounded = true,
  animate = true,
}: SkeletonItemProps) {
  // Check if height contains arbitrary values (like h-[350px])
  const isArbitraryHeight = height.includes('[') && height.includes(']');

  const baseClasses = isArbitraryHeight
    ? `bg-muted ${width}`
    : `${height} bg-muted ${width}`;
  const roundedClasses = rounded ? 'rounded' : '';
  const animateClasses = animate ? 'animate-pulse' : '';

  // For arbitrary heights, use inline style
  const style = isArbitraryHeight
    ? { height: height.replace('h-[', '').replace(']', '') }
    : {};

  return (
    <div
      className={`${baseClasses} ${roundedClasses} ${animateClasses} ${className}`}
      style={style}
    />
  );
}

// Skeleton card container
export function SkeletonCard({ className = '', children }: SkeletonCardProps) {
  return <div className={`card card-padding ${className}`}>{children}</div>;
}

// Skeleton table rows
export function SkeletonTable({
  rows = 5,
  columns = 4,
  className = '',
  showHeader = true,
}: SkeletonTableProps) {
  return (
    <div className={`card overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-border">
          {showHeader && (
            <thead className="bg-muted">
              <tr>
                {Array.from({ length: columns }).map((_, i) => (
                  <th key={i} className="px-6 py-3 text-left">
                    <SkeletonItem width="w-24" height="h-4" />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="table-body-card">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="space-y-2">
                      <SkeletonItem width="w-full" height="h-4" />
                      {colIndex === 0 && (
                        <SkeletonItem width="w-3/4" height="h-3" />
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Skeleton list items
export function SkeletonList({
  items = 5,
  className = '',
  itemHeight = 'h-20',
}: SkeletonListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="card card-padding-sm">
          <div className="flex items-center space-x-4">
            <SkeletonItem width="w-12" height="h-12" rounded={true} />
            <div className="flex-1 space-y-2">
              <SkeletonItem width="w-1/3" height="h-4" />
              <SkeletonItem width="w-1/2" height="h-3" />
            </div>
            <div className="flex space-x-2">
              <SkeletonItem width="w-16" height="h-8" />
              <SkeletonItem width="w-16" height="h-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton for search cards
export function SkeletonSearchCard({ className = '' }: { className?: string }) {
  return (
    <SkeletonCard className={className}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <SkeletonItem width="w-48" height="h-6" />
            <SkeletonItem width="w-32" height="h-4" />
          </div>
          <div className="flex gap-3">
            <SkeletonItem width="w-32" height="h-10" />
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <SkeletonItem width="w-full" height="h-10" />
          <SkeletonItem width="w-32" height="h-10" />
          <SkeletonItem width="w-32" height="h-10" />
          <SkeletonItem width="w-10" height="h-10" />
        </div>
      </div>
    </SkeletonCard>
  );
}

// Skeleton for game server cards (enhanced to match actual card layout)
export function SkeletonGameServerCard({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div
      className={`card overflow-hidden h-[380px] flex flex-col ${className}`}
    >
      {/* Game Server Header */}
      <div className="relative px-5 py-4 border-b border-border bg-muted overflow-hidden">
        {/* Title Row */}
        <div className="flex items-center space-x-3 relative z-10">
          <div className="min-w-0 flex-1">
            <SkeletonItem width="w-32" height="h-6" className="mb-2" />
            <div className="flex items-center space-x-1">
              <SkeletonItem width="w-4" height="h-4" rounded={true} />
              <SkeletonItem width="w-24" height="h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Game Server Info */}
      <div className="relative px-4 py-3 pt-0 flex-grow">
        <div className="relative p-2">
          {/* Resource Pie Charts */}
          <div className="grid gap-3 grid-cols-3">
            {/* Players Chart */}
            <div className="text-center">
              <div className="mx-auto mb-1 w-16 h-16 rounded-full border-4 border-border animate-pulse" />
              <SkeletonItem
                width="w-12"
                height="h-3"
                className="mx-auto mb-1"
              />
              <SkeletonItem width="w-8" height="h-3" className="mx-auto" />
            </div>

            {/* CPU Chart */}
            <div className="text-center">
              <div className="mx-auto mb-1 w-16 h-16 rounded-full border-4 border-border animate-pulse" />
              <SkeletonItem width="w-8" height="h-3" className="mx-auto mb-1" />
              <SkeletonItem width="w-6" height="h-3" className="mx-auto" />
            </div>

            {/* Memory Chart */}
            <div className="text-center">
              <div className="mx-auto mb-1 w-16 h-16 rounded-full border-4 border-border animate-pulse" />
              <SkeletonItem
                width="w-12"
                height="h-3"
                className="mx-auto mb-1"
              />
              <SkeletonItem width="w-8" height="h-3" className="mx-auto" />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="border-t border-border pt-4 space-y-1">
          <div className="flex justify-between">
            <SkeletonItem width="w-16" height="h-3" />
            <SkeletonItem width="w-20" height="h-3" />
          </div>
          <div className="flex justify-between">
            <SkeletonItem width="w-12" height="h-3" />
            <SkeletonItem width="w-16" height="h-3" />
          </div>
          <div className="flex justify-between">
            <SkeletonItem width="w-8" height="h-3" />
            <SkeletonItem width="w-20" height="h-3" />
          </div>
          <div className="flex justify-between">
            <SkeletonItem width="w-8" height="h-3" />
            <SkeletonItem width="w-16" height="h-3" />
          </div>
          <div className="flex justify-between">
            <SkeletonItem width="w-8" height="h-3" />
            <SkeletonItem width="w-20" height="h-3" />
          </div>
        </div>
      </div>

      {/* Game Server Actions */}
      <div className="px-4 py-3 bg-card border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center gap-1">
              <SkeletonItem width="w-8" height="h-8" rounded={true} />
              <SkeletonItem width="w-8" height="h-8" rounded={true} />
              <SkeletonItem width="w-8" height="h-8" rounded={true} />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <SkeletonItem width="w-8" height="h-8" rounded={true} />
            <SkeletonItem width="w-8" height="h-8" rounded={true} />
            <SkeletonItem width="w-8" height="h-8" rounded={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton for game configuration cards
export function SkeletonGameCard({ className = '' }: { className?: string }) {
  return (
    <div className={`card card-padding-sm ${className}`}>
      <div className="flex items-center space-x-4">
        <SkeletonItem width="w-12" height="h-12" rounded={true} />
        <div className="flex-1 space-y-2">
          <SkeletonItem width="w-40" height="h-4" />
          <SkeletonItem width="w-64" height="h-3" />
        </div>
        <div className="flex items-center space-x-2">
          <SkeletonItem width="w-24" height="h-6" rounded={true} />
          <SkeletonItem width="w-20" height="h-6" rounded={true} />
        </div>
      </div>
    </div>
  );
}

// Skeleton for user cards
export function SkeletonUserCard({ className = '' }: { className?: string }) {
  return (
    <div className={`card card-padding-sm ${className}`}>
      <div className="flex items-center space-x-4">
        <SkeletonItem width="w-12" height="h-12" rounded={true} />
        <div className="flex-1 space-y-2">
          <SkeletonItem width="w-32" height="h-4" />
          <SkeletonItem width="w-40" height="h-3" />
        </div>
        <div className="flex items-center space-x-2">
          <SkeletonItem width="w-20" height="h-6" rounded={true} />
          <SkeletonItem width="w-16" height="h-6" rounded={true} />
        </div>
      </div>
    </div>
  );
}

// Skeleton for node cards (enhanced to match actual card layout)
export function SkeletonNodeCard({ className = '' }: { className?: string }) {
  return (
    <div className={`card overflow-hidden min-h-[320px] ${className}`}>
      {/* Node Header */}
      <div className="px-4 py-3 border-b border-border bg-muted">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* OS Icon */}
            <SkeletonItem width="w-8" height="h-8" />
            <div>
              <SkeletonItem width="w-32" height="h-5" className="mb-1" />
              <SkeletonItem width="w-24" height="h-4" className="mb-1" />
              <SkeletonItem width="w-20" height="h-3" />
            </div>
          </div>
          <SkeletonItem width="w-20" height="h-6" rounded={true} />
        </div>
      </div>

      {/* Node Info */}
      <div className="px-4 py-3">
        {/* Resource Usage Charts */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* CPU Chart */}
          <div className="text-center">
            <SkeletonItem
              width="w-16"
              height="h-16"
              rounded={true}
              className="mx-auto mb-1"
            />
            <SkeletonItem width="w-8" height="h-3" className="mx-auto mb-1" />
            <SkeletonItem width="w-6" height="h-3" className="mx-auto" />
          </div>

          {/* RAM Chart */}
          <div className="text-center">
            <SkeletonItem
              width="w-16"
              height="h-16"
              rounded={true}
              className="mx-auto mb-1"
            />
            <SkeletonItem width="w-8" height="h-3" className="mx-auto mb-1" />
            <SkeletonItem width="w-6" height="h-3" className="mx-auto" />
          </div>

          {/* Storage Chart */}
          <div className="text-center">
            <SkeletonItem
              width="w-16"
              height="h-16"
              rounded={true}
              className="mx-auto mb-1"
            />
            <SkeletonItem width="w-12" height="h-3" className="mx-auto mb-1" />
            <SkeletonItem width="w-8" height="h-3" className="mx-auto" />
          </div>
        </div>

        {/* Game Servers Info */}
        <div className="bg-muted rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <SkeletonItem width="w-24" height="h-4" />
            <SkeletonItem width="w-16" height="h-4" />
          </div>
          <SkeletonItem
            width="w-full"
            height="h-2"
            rounded={true}
            className="mb-1"
          />
          <SkeletonItem width="w-32" height="h-3" />
        </div>

        {/* System Info */}
        <div className="text-xs text-muted-foreground mb-3">
          <div className="flex justify-between mb-1">
            <SkeletonItem width="w-12" height="h-3" />
            <SkeletonItem width="w-16" height="h-3" />
          </div>
          <div className="flex justify-between">
            <SkeletonItem width="w-16" height="h-3" />
            <SkeletonItem width="w-20" height="h-3" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center pt-3 border-t border-border">
          <div className="flex space-x-2">
            <SkeletonItem width="w-20" height="h-8" rounded={true} />
            <SkeletonItem width="w-8" height="h-8" rounded={true} />
            <SkeletonItem width="w-8" height="h-8" rounded={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton for tenant cards
export function SkeletonTenantCard({ className = '' }: { className?: string }) {
  return (
    <div className={`card card-padding-sm ${className}`}>
      <div className="flex items-center space-x-4">
        <SkeletonItem width="w-12" height="h-12" rounded={true} />
        <div className="flex-1 space-y-2">
          <SkeletonItem width="w-40" height="h-4" />
          <SkeletonItem width="w-56" height="h-3" />
        </div>
        <div className="flex items-center space-x-2">
          <SkeletonItem width="w-28" height="h-6" rounded={true} />
          <SkeletonItem width="w-20" height="h-6" rounded={true} />
        </div>
      </div>
    </div>
  );
}

// Skeleton for dashboard stats
export function SkeletonStats({ className = '' }: { className?: string }) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card card-padding">
          <div className="space-y-3">
            <SkeletonItem width="w-24" height="h-4" />
            <SkeletonItem width="w-16" height="h-8" />
            <SkeletonItem width="w-32" height="h-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton for recent activity
export function SkeletonRecentActivity({
  items = 5,
  className = '',
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <SkeletonItem width="w-8" height="h-8" rounded={true} />
          <div className="flex-1 space-y-2">
            <SkeletonItem width="w-full" height="h-4" />
            <SkeletonItem width="w-1/2" height="h-3" />
          </div>
          <SkeletonItem width="w-20" height="h-4" />
        </div>
      ))}
    </div>
  );
}

// Skeleton for forms
export function SkeletonForm({
  fields = 4,
  className = '',
}: {
  fields?: number;
  className?: string;
}) {
  return (
    <SkeletonCard className={className}>
      <div className="space-y-6">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonItem width="w-24" height="h-4" />
            <SkeletonItem width="w-full" height="h-10" />
          </div>
        ))}
        <div className="flex justify-end space-x-3 pt-4">
          <SkeletonItem width="w-20" height="h-10" />
          <SkeletonItem width="w-24" height="h-10" />
        </div>
      </div>
    </SkeletonCard>
  );
}

// Skeleton cards grid layout for game servers
export function SkeletonGameServerCards({
  items = 4,
  className = '',
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 ${className}`}
    >
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonGameServerCard key={i} />
      ))}
    </div>
  );
}

// Skeleton cards grid layout for nodes
export function SkeletonNodeCards({
  items = 3,
  className = '',
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 ${className}`}
    >
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonNodeCard key={i} />
      ))}
    </div>
  );
}

// Skeleton for node table/list view (card-style layout)
export function SkeletonNodeTable({
  items = 3,
  className = '',
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          {/* Node Card Header */}
          <div className="px-6 py-4 border-b border-border bg-muted">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* OS Icon */}
                <SkeletonItem width="w-8" height="h-8" />
                <div>
                  <SkeletonItem width="w-32" height="h-5" className="mb-1" />
                  <SkeletonItem width="w-28" height="h-4" className="mb-1" />
                  <SkeletonItem width="w-20" height="h-3" />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Node Type */}
                <div className="flex items-center">
                  <SkeletonItem width="w-6" height="h-6" className="mr-2" />
                  <SkeletonItem width="w-16" height="h-4" />
                </div>

                {/* Status Badge */}
                <SkeletonItem width="w-20" height="h-6" rounded={true} />
              </div>
            </div>
          </div>

          {/* Node Card Content */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Resources Section */}
              <div className="lg:col-span-2">
                <SkeletonItem width="w-20" height="h-4" className="mb-3" />
                <div className="flex items-start space-x-6">
                  {/* Resource Charts */}
                  {Array.from({ length: 3 }).map((_, chartIndex) => (
                    <div key={chartIndex} className="text-center">
                      <SkeletonItem
                        width="w-14"
                        height="h-14"
                        rounded={true}
                        className="mx-auto mb-1"
                      />
                      <SkeletonItem
                        width="w-8"
                        height="h-3"
                        className="mx-auto mb-1"
                      />
                      <SkeletonItem
                        width="w-10"
                        height="h-3"
                        className="mx-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Game Servers Section */}
              <div>
                <SkeletonItem width="w-24" height="h-4" className="mb-3" />
                <div className="space-y-2">
                  <SkeletonItem width="w-12" height="h-5" />
                  <SkeletonItem width="w-20" height="h-3" />
                </div>
              </div>

              {/* System Info Section */}
              <div>
                <SkeletonItem width="w-20" height="h-4" className="mb-3" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <SkeletonItem width="w-12" height="h-3" />
                    <SkeletonItem width="w-16" height="h-3" />
                  </div>
                  <div className="flex justify-between">
                    <SkeletonItem width="w-16" height="h-3" />
                    <SkeletonItem width="w-20" height="h-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end items-center pt-4 border-t border-border mt-4">
              <div className="flex space-x-2">
                <SkeletonItem width="w-16" height="h-8" rounded={true} />
                <SkeletonItem width="w-8" height="h-8" rounded={true} />
                <SkeletonItem width="w-8" height="h-8" rounded={true} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton for game server table/list view (card-style layout)
export function SkeletonGameServerTable({
  items = 3,
  className = '',
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="card overflow-hidden min-h-[200px] flex flex-col"
        >
          {/* Game Server Header */}
          <div className="relative px-5 py-4 border-b border-border bg-muted overflow-hidden">
            {/* Title Row */}
            <div className="flex items-center space-x-3 relative z-10">
              <div className="min-w-0 flex-1">
                <SkeletonItem width="w-32" height="h-6" className="mb-2" />
                <div className="flex items-center space-x-1">
                  <SkeletonItem width="w-4" height="h-4" rounded={true} />
                  <SkeletonItem width="w-24" height="h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Game Server Info */}
          <div className="relative px-4 py-3 pt-0 flex-grow">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
              {/* Player Stats and Resource Usage */}
              <div className="flex-shrink-0 w-full md:w-auto">
                <div className="grid gap-2 grid-cols-3">
                  {/* Players Chart */}
                  <div className="text-center">
                    <div className="mx-auto mb-1 w-16 h-16 rounded-full border-4 border-border animate-pulse" />
                    <SkeletonItem
                      width="w-12"
                      height="h-3"
                      className="mx-auto mb-1"
                    />
                    <SkeletonItem
                      width="w-8"
                      height="h-3"
                      className="mx-auto"
                    />
                  </div>

                  {/* CPU Chart */}
                  <div className="text-center">
                    <div className="mx-auto mb-1 w-16 h-16 rounded-full border-4 border-border animate-pulse" />
                    <SkeletonItem
                      width="w-8"
                      height="h-3"
                      className="mx-auto mb-1"
                    />
                    <SkeletonItem
                      width="w-6"
                      height="h-3"
                      className="mx-auto"
                    />
                  </div>

                  {/* Memory Chart */}
                  <div className="text-center">
                    <div className="mx-auto mb-1 w-16 h-16 rounded-full border-4 border-border animate-pulse" />
                    <SkeletonItem
                      width="w-12"
                      height="h-3"
                      className="mx-auto mb-1"
                    />
                    <SkeletonItem
                      width="w-8"
                      height="h-3"
                      className="mx-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="text-sm text-muted-foreground flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                <div className="flex justify-between">
                  <SkeletonItem width="w-16" height="h-3" />
                  <SkeletonItem width="w-20" height="h-3" />
                </div>
                <div className="flex justify-between">
                  <SkeletonItem width="w-12" height="h-3" />
                  <SkeletonItem width="w-16" height="h-3" />
                </div>
                <div className="flex justify-between">
                  <SkeletonItem width="w-8" height="h-3" />
                  <SkeletonItem width="w-20" height="h-3" />
                </div>
                <div className="flex justify-between">
                  <SkeletonItem width="w-8" height="h-3" />
                  <SkeletonItem width="w-16" height="h-3" />
                </div>
                <div className="flex justify-between">
                  <SkeletonItem width="w-8" height="h-3" />
                  <SkeletonItem width="w-20" height="h-3" />
                </div>
                <div className="flex justify-between">
                  <SkeletonItem width="w-8" height="h-3" />
                  <SkeletonItem width="w-16" height="h-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Game Server Actions */}
          <div className="px-4 py-3 bg-card border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center gap-1">
                  <SkeletonItem width="w-8" height="h-8" rounded={true} />
                  <SkeletonItem width="w-8" height="h-8" rounded={true} />
                  <SkeletonItem width="w-8" height="h-8" rounded={true} />
                </div>
              </div>

              <div className="flex items-center gap-1">
                <SkeletonItem width="w-8" height="h-8" rounded={true} />
                <SkeletonItem width="w-8" height="h-8" rounded={true} />
                <SkeletonItem width="w-8" height="h-8" rounded={true} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton for games table (traditional DataTable layout)
export function SkeletonGamesTable({
  items = 3,
  className = '',
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg ${className}`}
    >
      <table className="min-w-full divide-y divide-gray-300">
        {/* Table Header */}
        <thead className="bg-muted">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Game
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Port
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Mode
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Created
            </th>
            <th className="px-2 py-1 rounded-md bg-muted backdrop-blur-sm text-center text-xs font-medium text-muted-foreground uppercase tracking-wider sticky right-0">
              Actions
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="table-body-card">
          {Array.from({ length: items }).map((_, i) => (
            <tr key={i} className="hover:bg-muted">
              {/* Game Column */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <SkeletonItem width="w-10" height="h-10" rounded={true} />
                  </div>
                  <div className="ml-4 min-w-0 flex-1">
                    <SkeletonItem width="w-32" height="h-4" className="mb-1" />
                    <SkeletonItem width="w-48" height="h-3" />
                  </div>
                </div>
              </td>

              {/* Type Column */}
              <td className="px-6 py-4 whitespace-nowrap">
                <SkeletonItem width="w-20" height="h-4" className="mb-1" />
                <SkeletonItem width="w-16" height="h-3" />
              </td>

              {/* Port Column */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <SkeletonItem width="w-16" height="h-6" rounded={true} />
                  <SkeletonItem width="w-8" height="h-3" />
                </div>
              </td>

              {/* Mode Column */}
              <td className="px-6 py-4 whitespace-nowrap">
                <SkeletonItem
                  width="w-16"
                  height="h-6"
                  rounded={true}
                  className="mb-1"
                />
                <SkeletonItem width="w-24" height="h-3" />
              </td>

              {/* Status Column */}
              <td className="px-6 py-4 whitespace-nowrap">
                <SkeletonItem width="w-16" height="h-6" rounded={true} />
              </td>

              {/* Created Column */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                <SkeletonItem width="w-20" height="h-4" />
              </td>

              {/* Actions Column */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium sticky right-0 bg-card">
                <div className="flex items-center justify-end space-x-1">
                  <SkeletonItem width="w-8" height="h-8" rounded={true} />
                  <SkeletonItem width="w-8" height="h-8" rounded={true} />
                  <SkeletonItem width="w-8" height="h-8" rounded={true} />
                  <SkeletonItem width="w-8" height="h-8" rounded={true} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Skeleton for environments list (card-style layout)
export function SkeletonEnvironmentsList({
  items = 3,
  className = '',
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="card p-3">
          {/* Environment Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 w-full">
                <SkeletonItem width="w-5" height="h-5" />
                <div className="flex items-center justify-between w-full pr-6 md:pr-12">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <SkeletonItem width="w-24" height="h-5" />
                      <SkeletonItem width="w-16" height="h-5" rounded={true} />
                    </div>
                    <SkeletonItem width="w-48" height="h-3" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <SkeletonItem width="w-20" height="h-3" />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <SkeletonItem width="w-8" height="h-8" rounded={true} />
              </div>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="p-6">
            {Array.from({ length: 2 + (i % 3) }).map((_, varIndex) => (
              <div key={varIndex} className="mb-4 last:mb-0">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5">
                    <SkeletonItem width="w-32" height="h-4" className="mb-1" />
                    <SkeletonItem width="w-48" height="h-3" />
                  </div>
                  <div className="col-span-5 flex items-center space-x-2">
                    <SkeletonItem width="w-8" height="h-8" rounded={true} />
                    <SkeletonItem width="w-24" height="h-4" />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <SkeletonItem width="w-8" height="h-8" rounded={true} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
