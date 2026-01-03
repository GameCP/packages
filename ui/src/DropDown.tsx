'use client';

import { RiArrowDownSLine } from 'react-icons/ri';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2' | '3' | '4' | '5' | '6';

interface DropDownArrowProps {
  isOpen: boolean;
  disabled?: boolean;
  size?: Size;
  color?: 'default' | 'gray' | 'primary' | 'secondary';
  className?: string;
  'aria-hidden'?: boolean;
}

const sizeClasses: Record<Size, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2': 'w-2 h-2',
  '3': 'w-3 h-3',
  '4': 'w-4 h-4',
  '5': 'w-5 h-5',
  '6': 'w-6 h-6',
};

const colorClasses = {
  default: 'text-muted-foreground hover:text-muted-foreground',
  gray: 'text-muted-foreground hover:text-muted-foreground',
  primary: 'text-ring hover:text-primary-foreground',
  secondary: 'text-secondary-foreground hover:text-foreground',
};

export function DropDownArrow({
  isOpen,
  disabled = false,
  size = 'sm',
  color = 'default',
  className = '',
  'aria-hidden': ariaHidden,
}: DropDownArrowProps) {
  const baseClasses = `${sizeClasses[size]} flex-shrink-0 transition-transform`;
  const rotationClasses = isOpen ? 'rotate-180' : '';
  const colorClassesApplied = disabled
    ? 'text-muted-foreground'
    : colorClasses[color];
  const combinedClasses =
    `${baseClasses} ${rotationClasses} ${colorClassesApplied} ${className}`.trim();

  return (
    <RiArrowDownSLine className={combinedClasses} aria-hidden={ariaHidden} />
  );
}
