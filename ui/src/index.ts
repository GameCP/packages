/**
 * @gamecp/ui - GameCP UI Component Library
 * 
 * A collection of reusable React components for GameCP extensions.
 * All components are built with TypeScript and Tailwind CSS.
 */

// Core Components
export { default as Badge } from './Badge';
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as ConfirmDialog, useConfirmDialog } from './ConfirmDialog';
export { default as Container } from './Container';
export { default as EmptyState } from './EmptyState';
export { default as FormInput } from './FormInput';
export { default as FormSection } from './FormSection';
export { default as Grid } from './Grid';
export { default as Link } from './Link';
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as Modal } from './Modal';
export { default as PageHeader } from './PageHeader';
export { default as Switch } from './Switch';
export { default as SmartDropdown, SmartSelect } from './SmartDropdown';
export { Skeleton, SkeletonItem } from './Skeleton';
export { Typography } from './Typography';

// Type exports
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';
export type { BadgeVariant, BadgeSize } from './Badge';
export type { LinkProps } from './Link';
export type { ConfirmDialogOptions } from './ConfirmDialog';

// Version
export const VERSION = '0.1.3';
