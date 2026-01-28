'use client';

import { useState } from 'react';
import { useLocale } from '@/hooks/useLocale';
import Select from '../dropdowns/presets/Select';

// Supported locale constants
const Locales = {
  ENGLISH: 'en',
  SPANISH: 'es',
  ROMANIAN: 'ro',
  PORTUGUESE_BRAZIL: 'pt-BR',
  DANISH: 'da',
  CHINESE_SIMPLIFIED_CHINA: 'zh-CN',
  CHINESE_TAIWAN: 'zh-TW',
} as const;

// Supported locale values as strings (matching website)
const SUPPORTED_LOCALES = [
  Locales.ENGLISH,
  Locales.SPANISH,
  Locales.ROMANIAN,
  Locales.PORTUGUESE_BRAZIL,
  Locales.DANISH,
  Locales.CHINESE_SIMPLIFIED_CHINA,
  Locales.CHINESE_TAIWAN,
] as const;

// Language names in their native language
const LANGUAGE_NAMES: Record<string, string> = {
  [Locales.ENGLISH]: 'English',
  [Locales.SPANISH]: 'Español',
  [Locales.ROMANIAN]: 'Română',
  [Locales.PORTUGUESE_BRAZIL]: 'Português (BR)',
  [Locales.DANISH]: 'Dansk',
  [Locales.CHINESE_SIMPLIFIED_CHINA]: '简体中文',
  [Locales.CHINESE_TAIWAN]: '繁體中文',
};

interface LanguageSelectorProps {
  variant?: 'user' | 'tenant';
  currentLanguage?: string;
  onLanguageChange?: (language: string) => Promise<void>;
}

/**
 * Language selector component
 * Can be used for both user preferences and tenant settings
 */
export function LanguageSelector({
  variant = 'user',
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const { locale, updateLocale } = useLocale();
  const [isUpdating, setIsUpdating] = useState(false);

  // Get current locale as string
  const currentLocale = locale as unknown as string;
  const activeLanguage = currentLanguage || currentLocale;

  // If context is not available yet, show loading state
  if (!locale) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-muted animate-pulse rounded"></div>
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  const handleLanguageChange = async (newLanguage: string) => {
    if (newLanguage === activeLanguage) return;

    setIsUpdating(true);
    try {
      if (onLanguageChange) {
        // Custom handler (e.g., for tenant settings)
        await onLanguageChange(newLanguage);
      } else {
        // Default handler (user preferences)
        await updateLocale(newLanguage as any);
      }
    } catch (error) {
      console.error('Failed to update language:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="form-label">
        {variant === 'user' ? 'Preferred Language' : 'Default Language'}
      </label>
      <Select
        value={activeLanguage}
        onChange={value => handleLanguageChange(Array.isArray(value) ? value[0] : value)}
        options={SUPPORTED_LOCALES.map(localeCode => ({
          value: localeCode,
          label: LANGUAGE_NAMES[localeCode] || localeCode,
        }))}
        placeholder="Select language"
        disabled={isUpdating}
        className="w-full"
      />
      {variant === 'user' && (
        <p className="text-xs text-muted-foreground">
          This will be your preferred language across the application
        </p>
      )}
      {variant === 'tenant' && (
        <p className="text-xs text-muted-foreground">
          This will be the default language for all users in your organization
        </p>
      )}
    </div>
  );
}
