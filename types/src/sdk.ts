/**
 * GameCP SDK Types
 * Types for the client-side SDK available to extensions via window.GameCP_SDK
 */

// React types (extensions will have React available)
type ReactNode = any;
type ComponentType<P = {}> = any;

/**
 * GameCP SDK - Available globally in extension UI components
 */
export interface GameCPSDK {
  /** Navigation link component */
  Link: ComponentType<LinkProps>;
  
  /** Button component with loading states */
  Button: ComponentType<ButtonProps>;
  
  /** Card container component */
  Card: ComponentType<CardProps>;
  
  /** Badge/label component */
  Badge: ComponentType<BadgeProps>;
  
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
  icon?: ComponentType<any>;
  iconColor?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  headerClassName?: string;
  className?: string;
  children: ReactNode;
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
