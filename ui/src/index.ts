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
export { default as FormInput } from './FormInput';
export { default as FormSection } from './FormSection';
export { default as Grid } from './Grid';
export { default as Link } from './Link';
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as Modal } from './Modal';
export { default as PageHeader } from './PageHeader';
export { default as Switch } from './Switch';

// Types
export type { BadgeProps, BadgeVariant, BadgeSize } from './Badge';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';
export type { CardProps } from './Card';
export type { ConfirmDialogOptions } from './ConfirmDialog';
export type { FormSectionProps } from './FormSection';
export type { GridProps, GridItemProps } from './Grid';
export type { LinkProps } from './Link';
export type { LoadingSpinnerProps, SpinnerSize } from './LoadingSpinner';
export type { ModalProps } from './Modal';
export type { PageHeaderProps } from './PageHeader';
export type { SwitchProps } from './Switch';

// Version
export const VERSION = '0.1.0';
