import type { ReactNode } from 'react';

/**
 * Single dropdown item - flexible to support menus, selects, filters
 */
export interface DropdownItem {
  /** Unique value for selection */
  value: string;
  /** Display label - string or ReactNode */
  label: ReactNode;
  /** Optional description/subtitle */
  description?: ReactNode;
  /** Optional icon (React component, element, or null) */
  icon?: ReactNode;
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Visual variant for the item */
  variant?: 'default' | 'danger' | 'success' | 'warning';
  /** Optional example text (for variable inputs) */
  example?: string;
  /** Any additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Pagination info for dropdown footer
 */
export interface DropdownPaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Position options for dropdown placement
 */
export type DropdownPosition =
  | 'auto'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-left-aligned'
  | 'bottom-left-aligned';

/**
 * Base props shared by all dropdown variants
 */
export interface DropdownBaseProps {
  /** The trigger element that opens the dropdown */
  trigger: ReactNode;
  /** Whether the dropdown is disabled */
  disabled?: boolean;
  /** Width of dropdown panel */
  width?: number | 'auto' | 'fit-content';
  /** Max height before scrolling */
  maxHeight?: number;
  /** Offset from trigger */
  offset?: number;
  /** Position preference */
  position?: DropdownPosition;
  /** Custom className for dropdown panel */
  className?: string;
  /** Custom className for trigger wrapper (for width classes like w-full) */
  triggerClassName?: string;
  /** ID for accessibility */
  id?: string;
  /** Called when dropdown opens - useful for lazy loading */
  onOpen?: () => void;
  /** Called when dropdown closes */
  onClose?: () => void;
}

/**
 * Props for item-based dropdowns (menus, selects)
 */
export interface DropdownItemsProps {
  /** Array of items to display */
  items: DropdownItem[];
  /** Currently selected value(s) */
  value?: string | string[];
  /** Selection change handler */
  onChange?: (value: string | string[]) => void;
  /** Allow multiple selections */
  multiple?: boolean;
  /** Close dropdown after selection (default: true for single, false for multiple) */
  closeOnSelect?: boolean;
}

/**
 * Props for custom content dropdowns
 */
export interface DropdownContentProps {
  /** Custom children content */
  children: ReactNode;
}

/**
 * Slot props for header/footer
 */
export interface DropdownSlotProps {
  /** Header content (search, filters, etc.) */
  header?: ReactNode;
  /** Footer content (pagination, actions, etc.) */
  footer?: ReactNode;
}

/**
 * Full Dropdown component props - supports items OR children
 */
export type DropdownProps = DropdownBaseProps &
  DropdownSlotProps &
  (
    | (DropdownItemsProps & { children?: never })
    | (DropdownContentProps & { items?: never; value?: never; onChange?: never; multiple?: never; closeOnSelect?: never })
  );
