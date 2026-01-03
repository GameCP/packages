'use client';

import { useState, useCallback } from 'react';

interface UseKeyboardNavigationOptions {
  isOpen: boolean;
  optionsLength: number;
  onSelect: (index: number) => void;
  onClose: () => void;
  onOpen?: () => void;
}

interface UseKeyboardNavigationReturn {
  focusedIndex: number;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  resetFocus: () => void;
  setFocusedIndex: (index: number) => void;
}

/**
 * Reusable hook for keyboard navigation in dropdown components
 * Provides consistent arrow key navigation, Enter selection, and Escape handling
 */
export function useKeyboardNavigation({
  isOpen,
  optionsLength,
  onSelect,
  onClose,
  onOpen,
}: UseKeyboardNavigationOptions): UseKeyboardNavigationReturn {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const resetFocus = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        // Handle opening the dropdown
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          onOpen?.();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => (prev < optionsLength - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => (prev > 0 ? prev - 1 : optionsLength - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < optionsLength) {
            onSelect(focusedIndex);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          resetFocus();
          break;
        case 'Tab':
          onClose();
          resetFocus();
          break;
      }
    },
    [isOpen, optionsLength, focusedIndex, onSelect, onClose, onOpen, resetFocus]
  );

  return {
    focusedIndex,
    handleKeyDown,
    resetFocus,
    setFocusedIndex,
  };
}
