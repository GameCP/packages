'use client';

import React, { useState } from 'react';
import {
  RiAlertLine,
  RiCloseLine,
  RiUserLine,
  RiServerLine,
  RiArrowRightLine,
} from 'react-icons/ri';
import { useUserLimits, usePermission } from '@/stores/authStore';
import Button from '@/components/ui/Button';

interface LimitWarningData {
  users: {
    percentage: number;
    showWarning: boolean;
    currentCount: number;
    limit: number;
  };
  servers: {
    percentage: number;
    showWarning: boolean;
    currentCount: number;
    limit: number;
  };
  nodes: {
    percentage: number;
    showWarning: boolean;
    currentCount: number;
    limit: number;
  };
  hasWarnings: boolean;
  hasLimitsReached: boolean;
}

export default function LimitWarningBanner() {
  const limitStatus = useUserLimits();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPendingDismissed, setIsPendingDismissed] = useState(false);
  const canViewBilling = usePermission('billing.view');

  // Convert limitStatus to warning data format
  // Note: Users are excluded from warnings - they don't affect licensing/upgrade prompts
  const warningData: LimitWarningData | null = limitStatus
    ? {
        users: {
          percentage: limitStatus.users.usagePercentage,
          showWarning: false, // Users excluded from warnings
          currentCount: limitStatus.users.currentCount,
          limit: limitStatus.users.limit,
        },
        servers: {
          percentage: limitStatus.servers.usagePercentage,
          showWarning: limitStatus.servers.showWarning,
          currentCount: limitStatus.servers.currentCount,
          limit: limitStatus.servers.limit,
        },
        nodes: {
          percentage: limitStatus.nodes.usagePercentage,
          showWarning: limitStatus.nodes.showWarning,
          currentCount: limitStatus.nodes.currentCount,
          limit: limitStatus.nodes.limit,
        },
        // Recalculate hasWarnings excluding users
        hasWarnings:
          limitStatus.servers.showWarning || limitStatus.nodes.showWarning,
        hasLimitsReached:
          limitStatus.servers.usagePercentage >= 100 ||
          limitStatus.nodes.usagePercentage >= 100,
      }
    : null;

  const isVisible = warningData?.hasWarnings && !isDismissed;

  // Pending cancellation logic - now from unified limitStatus
  const pendingCancellations = limitStatus?.pendingCancellations;
  const hasPendingCancellations =
    pendingCancellations && pendingCancellations.count > 0;
  const isPendingVisible = hasPendingCancellations && !isPendingDismissed;

  // Calculate time until grace period ends
  let daysUntilGracePeriod = 0;
  let hoursUntilGracePeriod = 0;
  let pendingSeverity: 'info' | 'warning' | 'danger' = 'info';

  if (pendingCancellations?.earliestGracePeriodEnd) {
    const now = new Date();
    const gracePeriodEnd = new Date(
      pendingCancellations.earliestGracePeriodEnd
    );
    const msUntilEnd = gracePeriodEnd.getTime() - now.getTime();
    daysUntilGracePeriod = Math.floor(msUntilEnd / (1000 * 60 * 60 * 24));
    hoursUntilGracePeriod = Math.floor(
      (msUntilEnd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    // Set severity based on time remaining
    if (daysUntilGracePeriod < 1) {
      pendingSeverity = 'danger'; // Less than 1 day
    } else if (daysUntilGracePeriod < 7) {
      pendingSeverity = 'warning'; // Less than 7 days
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  const handlePendingDismiss = () => {
    setIsPendingDismissed(true);
  };

  // Only consider servers and nodes for max percentage (users excluded)
  const maxPercentage = warningData
    ? Math.max(warningData.servers.percentage, warningData.nodes.percentage)
    : 0;

  const isError = maxPercentage >= 100;

  return (
    <>
      {/* Pending Cancellation Banner */}
      {isPendingVisible && (
        <div
          className={`
            sticky top-0 z-20 border-b-2 backdrop-blur-md transition-all duration-200
            ${
              pendingSeverity === 'danger'
                ? 'border-b-danger bg-danger/10 dark:bg-danger/20'
                : pendingSeverity === 'warning'
                  ? 'border-b-amber bg-amber/10 dark:bg-amber/20'
                  : 'border-b-info bg-info/10 dark:bg-info/20'
            }
          `}
        >
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-2 md:py-2.5 gap-3">
              <div className="flex items-start space-x-3">
                <div
                  className={`
                  mt-0.5 rounded-full p-3 flex-shrink-0
                  ${
                    pendingSeverity === 'danger'
                      ? 'bg-danger/10 text-danger'
                      : pendingSeverity === 'warning'
                        ? 'bg-amber/10 text-amber'
                        : 'bg-info/10 text-info'
                  }
                `}
                >
                  <RiAlertLine className="h-5 w-5" />
                </div>

                <div className="space-y-0.5">
                  <h4
                    className={`font-semibold text-sm md:text-base leading-tight ${
                      pendingSeverity === 'danger'
                        ? 'text-danger'
                        : pendingSeverity === 'warning'
                          ? 'text-amber dark:text-amber'
                          : 'text-info dark:text-info'
                    }`}
                  >
                    {pendingCancellations.count} Subscription
                    {pendingCancellations.count > 1 ? 's' : ''} Pending
                    Cancellation
                  </h4>
                  <div className="text-xs md:text-sm font-medium text-muted-foreground">
                    <span className="text-foreground">
                      {pendingCancellations.totalNodes} node
                      {pendingCancellations.totalNodes > 1 ? 's' : ''}
                    </span>{' '}
                    will be removed in{' '}
                    <span
                      className={`font-semibold ${
                        pendingSeverity === 'danger'
                          ? 'text-danger'
                          : pendingSeverity === 'warning'
                            ? 'text-amber'
                            : 'text-info'
                      }`}
                    >
                      {daysUntilGracePeriod > 0 && `${daysUntilGracePeriod}d `}
                      {hoursUntilGracePeriod}h
                    </span>{' '}
                    • Remove nodes before grace period ends to avoid service
                    interruption
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-10 md:ml-0">
                <Button
                  onClick={handlePendingDismiss}
                  variant={
                    pendingSeverity === 'danger'
                      ? 'danger'
                      : pendingSeverity === 'warning'
                        ? 'warning'
                        : 'secondary'
                  }
                  size="sm"
                  className="whitespace-nowrap text-xs shadow-sm"
                  title="Dismiss this notice"
                >
                  Dismiss
                </Button>

                {canViewBilling && (
                  <Button
                    href="/settings/licensing"
                    variant="secondary"
                    size="sm"
                    icon={RiArrowRightLine}
                    className="whitespace-nowrap text-sm"
                    title="Manage your subscriptions"
                  >
                    Manage Subscriptions
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resource Usage Warning Banner */}
      {isVisible && warningData && (
        <div
          className={`
            sticky top-0 z-20 border-b-2 backdrop-blur-md transition-all duration-200
            ${
              isError
                ? 'border-b-danger bg-danger/10 dark:bg-danger/20'
                : 'border-b-amber bg-amber/10 dark:bg-amber/20'
            }
          `}
        >
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-2 md:py-2.5 gap-3">
              <div className="flex items-start space-x-3">
                <div
                  className={`
                  mt-0.5 rounded-full p-3 flex-shrink-0
                  ${isError ? 'bg-danger/10 text-danger' : 'bg-amber/10 text-amber'}
                `}
                >
                  <RiAlertLine className="h-5 w-5" />
                </div>

                <div className="space-y-0.5">
                  <h4
                    className={`font-semibold text-sm md:text-base leading-tight ${isError ? 'text-danger' : 'text-amber dark:text-amber'}`}
                  >
                    Resource Usage Warning
                  </h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs md:text-sm font-medium text-muted-foreground">
                    {warningData.users.showWarning && (
                      <div className="flex items-center">
                        <RiUserLine className="h-3.5 w-3.5 mr-1 opacity-70" />
                        <span>
                          Users:{' '}
                          <span className="text-foreground">
                            {warningData.users.currentCount}
                          </span>{' '}
                          / {warningData.users.limit}
                          <span
                            className={`ml-1 ${warningData.users.percentage >= 100 ? 'text-danger' : 'text-amber'}`}
                          >
                            ({warningData.users.percentage}%)
                          </span>
                        </span>
                      </div>
                    )}
                    {warningData.servers.showWarning && (
                      <div className="flex items-center">
                        <RiServerLine className="h-3.5 w-3.5 mr-1 opacity-70" />
                        <span>
                          Servers:{' '}
                          <span className="text-foreground">
                            {warningData.servers.currentCount}
                          </span>{' '}
                          / {warningData.servers.limit}
                          <span
                            className={`ml-1 ${warningData.servers.percentage >= 100 ? 'text-danger' : 'text-amber'}`}
                          >
                            ({warningData.servers.percentage}%)
                          </span>
                        </span>
                      </div>
                    )}
                    {warningData.nodes.showWarning && (
                      <div className="flex items-center">
                        <RiServerLine className="h-3.5 w-3.5 mr-1 opacity-70" />
                        <span>
                          Nodes:{' '}
                          <span className="text-foreground">
                            {warningData.nodes.currentCount}
                          </span>{' '}
                          / {warningData.nodes.limit}
                          <span
                            className={`ml-1 ${warningData.nodes.percentage >= 100 ? 'text-danger' : 'text-amber'}`}
                          >
                            ({warningData.nodes.percentage}%)
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-10 md:ml-0">
                <Button
                  onClick={handleDismiss}
                  variant={isError ? 'danger' : 'warning'}
                  size="sm"
                  className="whitespace-nowrap text-xs shadow-sm"
                  title="Dismiss this warning"
                  tooltipId="dismiss-warning-btn"
                >
                  Dismiss
                </Button>

                {canViewBilling && (
                  <Button
                    href="/settings/licensing"
                    variant="secondary"
                    size="sm"
                    icon={RiArrowRightLine}
                    className="whitespace-nowrap text-sm"
                    title="Go to licensing settings to upgrade your plan"
                    tooltipId="upgrade-license-btn"
                  >
                    Upgrade License
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
