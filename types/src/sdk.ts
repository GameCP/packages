/**
 * GameCP SDK Types
 * Types for the client-side SDK available to extensions via window.GameCP_SDK
 */

// React-compatible types (avoids version conflicts between packages)
export type ReactNode = React.ReactNode;

/** Component type that accepts props and returns JSX */
export type GameCPComponent<P = {}> = (props: P) => React.ReactElement | null;

/**
 * GameCP SDK - Available globally in extension UI components
 */
export interface GameCPSDK {
  /** Navigation link component */
  Link: GameCPComponent<LinkProps>;
  
  /** Button component with loading states */
  Button: GameCPComponent<ButtonProps>;
  
  /** Card container component */
  Card: GameCPComponent<CardProps>;
  
  /** Badge/label component */
  Badge: GameCPComponent<BadgeProps>;
  
  /** Form input component - text, email, password, number, select, textarea, checkbox */
  FormInput: GameCPComponent<FormInputProps>;
  
  /** Toggle switch component */
  Switch: GameCPComponent<SwitchProps>;
  
  /** Confirmation dialog utility */
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  
  /** Current user's locale (e.g., 'en', 'es', 'fr') */
  locale: string;
}

/**
 * GameCP API - HTTP client for extension API calls
 */
export interface GameCPAPI {
  /** Fetch wrapper for extension API calls */
  fetch: (url: string, options?: any) => Promise<any>;
}

/**
 * Link Component Props
 */
export interface LinkProps {
  href: string;
  className?: string;
  title?: string;
  children: ReactNode;
}

/**
 * Button Component Props
 */
export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: ReactNode;
}

/**
 * Card Component Props
 */
export interface CardProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  headerClassName?: string;
  className?: string;
  children?: ReactNode;
}

/**
 * Badge Component Props
 */
export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: ReactNode;
}

/**
 * Select Option for FormInput select type
 */
export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

/**
 * Form Input Component Props
 */
export interface FormInputProps {
  /** Field label */
  label: string;
  /** Field name (used for form submission) */
  name: string;
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'select' | 'checkbox' | 'textarea' | 'color';
  /** Current value */
  value: string | number | boolean;
  /** Change handler */
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether field is required */
  required?: boolean;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Error message to display */
  error?: string | ReactNode;
  /** Additional container class */
  className?: string;
  /** Additional input class */
  inputClassName?: string;
  /** Min value for number inputs */
  min?: number;
  /** Max value for number inputs */
  max?: number;
  /** Step for number inputs */
  step?: number;
  /** Max length for text inputs */
  maxLength?: number;
  /** Autocomplete attribute */
  autoComplete?: string;
  /** Description shown below label */
  description?: string | ReactNode;
  /** Description shown below input */
  footerDescription?: string | ReactNode;
  /** Auto focus on mount */
  autoFocus?: boolean;
  /** Options for select type */
  options?: SelectOption[];
  /** Allow multiple selection for select */
  multiSelect?: boolean;
  /** Enable search in select */
  searchable?: boolean;
  /** Show clear button */
  clearable?: boolean;
  /** Rows for textarea */
  rows?: number;
  /** Show/hide password toggle */
  showHidePassword?: boolean;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Switch Component Props
 */
export interface SwitchProps {
  /** Current checked state */
  checked: boolean;
  /** Change handler */
  onChange: (checked: boolean) => void;
  /** Whether switch is disabled */
  disabled?: boolean;
  /** Label for the switch */
  label?: string;
  /** Description text */
  description?: string;
  /** Additional class */
  className?: string;
}

/**
 * Confirmation Dialog Options
 */
export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  confirmButtonColor?: 'red' | 'blue' | 'green';
}

/**
 * Global Window Extensions
 * Use this to declare GameCP SDK in your extension's UI files:
 * 
 * declare global {
 *   interface Window extends GameCPWindow {}
 * }
 */
export interface GameCPWindow {
  GameCP_SDK: GameCPSDK;
  GameCP_API: GameCPAPI;
}

/**
 * Helper type for translation dictionaries
 */
export type TranslationDictionary<T extends string = string> = Record<T, string>;

/**
 * Translation content structure
 */
export interface TranslationContent {
  [key: string]: TranslationDictionary | TranslationContent;
}
