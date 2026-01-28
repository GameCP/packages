'use client';

import React from 'react';
import { RiCheckLine } from 'react-icons/ri';
import LoadingButton from '../buttons/LoadingButton';
import UnsavedChangesNotification from '../UnsavedChangesNotification';
import { ErrorAlert } from '../alerts/ErrorMessage';

interface FormFooterProps {
  /** Whether the form is currently submitting */
  isSubmitting?: boolean;
  /** Whether there are unsaved changes */
  hasUnsavedChanges?: boolean;
  /** Whether this is a new form (create mode) vs edit mode */
  isNew?: boolean;
  /** Error message to display */
  error?: string | null;
  /** Success message to display */
  success?: string | null;
  /** Cancel button text */
  cancelText?: string;
  /** Submit button text */
  submitText?: string;
  /** Submit button loading text */
  submitLoadingText?: string;
  /** Submit button icon */
  submitIcon?: React.ComponentType<{ className?: string }>;
  /** Whether submit button is disabled */
  submitDisabled?: boolean;
  /** Form ID to submit */
  formId?: string;
  /** Cancel button click handler */
  onCancel: () => void;
  /** Submit button click handler */
  onSubmit?: () => void;
  /** Layout variant */
  variant?: 'simple' | 'with-error' | 'with-notifications';
  /** Additional CSS classes */
  className?: string;
}

export default function FormFooter({
  isSubmitting = false,
  hasUnsavedChanges = false,
  isNew = false,
  error = null,
  success = null,
  cancelText = 'Cancel',
  submitText = 'Save',
  submitLoadingText,
  submitIcon,
  submitDisabled = false,
  formId,
  onCancel,
  onSubmit,
  variant = 'simple',
  className = '',
}: FormFooterProps) {
  const showError = error && variant === 'with-error';
  const showNotifications =
    variant === 'with-notifications' && (hasUnsavedChanges || success);
  const showUnsavedChanges = hasUnsavedChanges && !error && !success && !isNew;

  if (variant === 'simple') {
    return (
      <div className={`flex justify-end space-x-3 ${className}`}>
        {showUnsavedChanges && (
          <UnsavedChangesNotification
            show={true}
            variant="compact"
            className="mr-2"
          />
        )}
        <LoadingButton
          type="button"
          onClick={onCancel}
          variant="secondary"
          disabled={isSubmitting}
        >
          {cancelText}
        </LoadingButton>
        <LoadingButton
          type="submit"
          form={formId}
          onClick={onSubmit}
          isLoading={isSubmitting}
          loadingText={submitLoadingText}
          disabled={submitDisabled}
          icon={submitIcon}
        >
          {submitText}
        </LoadingButton>
      </div>
    );
  }

  if (variant === 'with-error') {
    return (
      <div className={`flex justify-between items-center ${className}`}>
        {/* Error display on the left */}
        <div className="flex-1 mr-4">
          {showError && <ErrorAlert message={error} className="mb-0" />}
        </div>

        {/* Buttons on the right */}
        <div className="flex items-center space-x-3">
          {showUnsavedChanges && (
            <UnsavedChangesNotification
              show={true}
              variant="compact"
              className="mr-2"
            />
          )}
          <LoadingButton
            type="button"
            onClick={onCancel}
            variant="secondary"
            disabled={isSubmitting}
          >
            {cancelText}
          </LoadingButton>
          <LoadingButton
            type="submit"
            form={formId}
            onClick={onSubmit}
            isLoading={isSubmitting}
            loadingText={submitLoadingText}
            disabled={submitDisabled || isSubmitting}
            icon={submitIcon}
          >
            {submitText}
          </LoadingButton>
        </div>
      </div>
    );
  }

  if (variant === 'with-notifications') {
    return (
      <div className={`flex justify-end space-x-3 ${className}`}>
        {showUnsavedChanges && (
          <UnsavedChangesNotification
            show={true}
            variant="compact"
            className="mr-2"
          />
        )}
        {success && !hasUnsavedChanges && (
          <div className="flex items-center text-success text-sm mr-2">
            <RiCheckLine className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{success}</span>
          </div>
        )}
        <LoadingButton
          type="button"
          onClick={onCancel}
          variant="secondary"
          disabled={isSubmitting}
        >
          {cancelText}
        </LoadingButton>
        <LoadingButton
          type="submit"
          form={formId}
          onClick={onSubmit}
          isLoading={isSubmitting}
          loadingText={submitLoadingText}
          disabled={submitDisabled}
          icon={submitIcon}
        >
          {submitText}
        </LoadingButton>
      </div>
    );
  }

  return null;
}
