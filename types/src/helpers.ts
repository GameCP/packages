/**
 * GameCP Extension SDK
 * Clean API for extension development
 * 
 * ⚠️ CLIENT-SIDE ONLY - Use in UI components, not in backend handlers
 */

import type { GameCPSDK, GameCPAPI } from './sdk';

// Helper to access window in client-side code
const getWindow = () => (typeof globalThis !== 'undefined' && 'window' in globalThis ? (globalThis as any).window : {}) as any;

/**
 * GameCP SDK - Clean interface for extensions
 * 
 * @example
 * ```typescript
 * import { gamecp } from '@gamecp/types';
 * 
 * // UI Components
 * const { Button, Card } = gamecp.ui;
 * 
 * // API calls
 * const data = await gamecp.api.get('/webhooks');
 * 
 * // i18n
 * const text = gamecp.t(translations);
 * const locale = gamecp.locale;
 * ```
 */
export const gamecp = {
  /** UI Components */
  get ui() {
    return getWindow().GameCP_SDK as GameCPSDK;
  },

  /** API client */
  api: {
    async get(url: string) {
      const response = await getWindow().GameCP_API.fetch(url);
      return response.json();
    },
    
    async post(url: string, data?: any) {
      const response = await getWindow().GameCP_API.fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    
    async put(url: string, data?: any) {
      const response = await getWindow().GameCP_API.fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    
    async delete(url: string, data?: any) {
      const response = await getWindow().GameCP_API.fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined,
      });
      return response.json();
    },
    
    /** Raw fetch for custom requests */
    fetch: (url: string, options?: any) => getWindow().GameCP_API.fetch(url, options),
  },

  /** Current user locale */
  get locale() {
    return getWindow().GameCP_SDK?.locale || 'en';
  },

  /** Translation helper */
  t(translations: Record<string, string>) {
    const locale = this.locale;
    return translations[locale] || translations.en;
  },

  /** Confirmation dialog */
  confirm(options: { title: string; message: string; confirmText: string; cancelText?: string }) {
    return getWindow().GameCP_SDK.confirm(options);
  },
};

/**
 * React hook for GameCP SDK
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { Button, Card, locale, t } = useGameCP();
 *   
 *   return (
 *     <Card title={t(content.title)}>
 *       <Button>Click me</Button>
 *     </Card>
 *   );
 * }
 * ```
 */
export function useGameCP() {
  return {
    // UI Components
    ...getWindow().GameCP_SDK,
    
    // Helpers
    locale: gamecp.locale,
    t: gamecp.t.bind(gamecp),
    api: gamecp.api,
    confirm: gamecp.confirm.bind(gamecp),
    
    // Config helper
    getConfig: (extensionId: string) => getWindow().GameCP_ExtensionConfig?.[extensionId] || {},
  };
}

/**
 * Translation hook
 * 
 * @example
 * ```typescript
 * const { t, locale } = useTranslation();
 * <h1>{t(content.title)}</h1>
 * ```
 */
export function useTranslation() {
  return {
    locale: gamecp.locale,
    t: gamecp.t.bind(gamecp),
  };
}

// Re-export types
export type { GameCPSDK, GameCPAPI };
