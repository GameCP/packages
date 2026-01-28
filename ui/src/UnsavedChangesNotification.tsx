'use client';

import React from 'react';
import { RiSaveLine } from 'react-icons/ri';
import { UnsavedAlert } from './alerts/ErrorMessage';

interface UnsavedChangesNotificationProps {
  /** Whether to show the notification */
  show: boolean;
  /** Variant style - 'banner' for full-width banner, 'compact' for inline notification */
  variant?: 'banner' | 'compact';
  /** Custom message text */
  message?: string;
  /** Custom subtitle text (only used in banner variant) */
  subtitle?: string;
  /** Whether the save button is loading */
  isSaving?: boolean;
  /** Save button text */
  saveButtonText?: string;
  /** Save button loading text */
  saveButtonLoadingText?: string;
  /** Callback when save button is clicked */
  onSave?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the save button */
  showSaveButton?: boolean;
}

export default function UnsavedChangesNotification({
  show,
  variant = 'banner',
  message = 'You have unsaved changes',
  subtitle = "Don't forget to save your changes before leaving this page.",
  isSaving = false,
  saveButtonText = 'Save Now',
  saveButtonLoadingText = 'Saving...',
  onSave,
  className = '',
  showSaveButton = true,
}: UnsavedChangesNotificationProps) {
  if (!show) return null;

  // Create the message content based on variant
  const messageContent =
    variant === 'compact' ? (
      message
    ) : (
      <div>
        <p className="font-semibold">{message}</p>
        <p className="text-sm opacity-80 mt-1">{subtitle}</p>
      </div>
    );

  // Create action button configuration if needed
  const actionButton =
    showSaveButton && onSave
      ? {
        text: saveButtonText,
        loadingText: saveButtonLoadingText,
        isLoading: isSaving,
        onClick: onSave,
        icon: RiSaveLine as any,
      }
      : undefined;

  return (
    <UnsavedAlert
      message={messageContent}
      className={className}
      actionButton={actionButton}
    />
  );
}
