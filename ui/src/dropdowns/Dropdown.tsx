'use client';

import {
    useState,
    useRef,
    useEffect,
    useCallback,
    type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import type {
    DropdownProps,
    DropdownItem as DropdownItemType,
    DropdownPosition,
} from './types';
import DropdownItem from './DropdownItem';

interface CalculatedPosition {
    top: number;
    left: number | undefined;
    right: number | undefined;
    width: number;
    maxHeight: number;
    isAbove: boolean;
}

/**
 * Core Dropdown component
 *
 * Handles:
 * - Open/close state management
 * - Portal-based positioning
 * - Animation
 * - Click-outside-to-close
 * - Resize/scroll repositioning
 * - Keyboard (Escape to close)
 *
 * Use with `items` for standard menus/selects,
 * or `children` for custom content.
 */
export default function Dropdown({
    trigger,
    disabled = false,
    width = 300,
    maxHeight = 400,
    offset = 8,
    position = 'auto',
    className = '',
    triggerClassName = '',
    id = 'dropdown',
    header,
    footer,
    onOpen,
    onClose,
    // Item mode props
    items,
    value,
    onChange,
    multiple = false,
    closeOnSelect,
    // Custom content mode
    children,
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [calculatedPosition, setCalculatedPosition] =
        useState<CalculatedPosition | null>(null);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Determine if should close on select
    const shouldCloseOnSelect = closeOnSelect ?? !multiple;

    // Call onOpen/onClose callbacks when state changes
    useEffect(() => {
        if (isOpen) {
            onOpen?.();
        } else {
            onClose?.();
        }
    }, [isOpen, onOpen, onClose]);

    // Calculate dropdown position relative to trigger
    const calculatePosition = useCallback(() => {
        if (!triggerRef.current) return null;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const margin = 16;

        // Determine actual width
        let actualWidth: number;
        if (width === 'auto' || width === 'fit-content') {
            actualWidth = Math.max(triggerRect.width, 200);
        } else {
            actualWidth = width;
        }

        // Calculate space above/below
        const spaceBelow = viewportHeight - triggerRect.bottom - margin;
        const spaceAbove = triggerRect.top - margin;

        // Determine if dropdown should appear above or below
        let isAbove = false;
        let calculatedMaxHeight = maxHeight;

        if (position === 'auto') {
            if (spaceBelow < maxHeight && spaceAbove > spaceBelow) {
                isAbove = true;
                calculatedMaxHeight = Math.min(maxHeight, spaceAbove);
            } else {
                calculatedMaxHeight = Math.min(maxHeight, spaceBelow);
            }
        } else if (position.startsWith('top')) {
            isAbove = true;
            calculatedMaxHeight = Math.min(maxHeight, spaceAbove);
        }

        // Calculate top position
        let top: number;
        if (isAbove) {
            top = triggerRect.top + window.scrollY - offset;
        } else {
            top = triggerRect.bottom + window.scrollY + offset;
        }

        // Calculate horizontal position
        let left: number | undefined;
        let right: number | undefined;

        if (position === 'top-right' || position === 'bottom-right') {
            right = viewportWidth - triggerRect.right;
        } else if (
            position === 'top-left-aligned' ||
            position === 'bottom-left-aligned'
        ) {
            // Align right edge of dropdown with right edge of trigger
            left = triggerRect.right - actualWidth;
        } else {
            left = triggerRect.left;
        }

        // Ensure dropdown doesn't go off-screen horizontally
        if (left !== undefined) {
            if (left + actualWidth > viewportWidth - margin) {
                left = viewportWidth - actualWidth - margin;
            }
            if (left < margin) {
                left = margin;
            }
        }

        return {
            top,
            left,
            right,
            width: actualWidth,
            maxHeight: calculatedMaxHeight,
            isAbove,
        };
    }, [width, maxHeight, offset, position]);

    // Update position when open
    useEffect(() => {
        if (isOpen) {
            const pos = calculatePosition();
            setCalculatedPosition(pos);
        }
    }, [isOpen, calculatePosition]);

    // Handle click outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            // Only handle keyboard if we have items
            if (!items || items.length === 0) {
                if (event.key === 'Escape') {
                    setIsOpen(false);
                }
                return;
            }

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    setFocusedIndex(prev => {
                        const nextIndex = prev < items.length - 1 ? prev + 1 : 0;
                        // Skip disabled items
                        let checkIndex = nextIndex;
                        while (items[checkIndex]?.disabled && checkIndex !== prev) {
                            checkIndex = checkIndex < items.length - 1 ? checkIndex + 1 : 0;
                        }
                        return checkIndex;
                    });
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    setFocusedIndex(prev => {
                        const nextIndex = prev > 0 ? prev - 1 : items.length - 1;
                        // Skip disabled items
                        let checkIndex = nextIndex;
                        while (items[checkIndex]?.disabled && checkIndex !== prev) {
                            checkIndex = checkIndex > 0 ? checkIndex - 1 : items.length - 1;
                        }
                        return checkIndex;
                    });
                    break;
                case 'Home':
                    event.preventDefault();
                    setFocusedIndex(0);
                    break;
                case 'End':
                    event.preventDefault();
                    setFocusedIndex(items.length - 1);
                    break;
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    if (focusedIndex >= 0 && focusedIndex < items.length) {
                        const item = items[focusedIndex];
                        if (!item.disabled) {
                            handleItemSelect(item);
                        }
                    }
                    break;
                case 'Escape':
                    event.preventDefault();
                    setIsOpen(false);
                    setFocusedIndex(-1);
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, items, focusedIndex]);

    // Handle resize/scroll
    useEffect(() => {
        if (!isOpen) return;

        const handleReposition = () => {
            const pos = calculatePosition();
            setCalculatedPosition(pos);
        };

        window.addEventListener('resize', handleReposition);
        window.addEventListener('scroll', handleReposition, true);

        return () => {
            window.removeEventListener('resize', handleReposition);
            window.removeEventListener('scroll', handleReposition, true);
        };
    }, [isOpen, calculatePosition]);

    // Handle item selection
    const handleItemSelect = (item: DropdownItemType) => {
        if (item.disabled || !onChange) return;

        if (multiple) {
            const currentValues = Array.isArray(value) ? value : value ? [value] : [];
            const isSelected = currentValues.includes(item.value);
            const newValues = isSelected
                ? currentValues.filter(v => v !== item.value)
                : [...currentValues, item.value];
            onChange(newValues);
        } else {
            onChange(item.value);
        }

        if (shouldCloseOnSelect) {
            setIsOpen(false);
        }
    };

    // Check if item is selected
    const isItemSelected = (itemValue: string): boolean => {
        if (!value) return false;
        if (Array.isArray(value)) return value.includes(itemValue);
        return value === itemValue;
    };

    // Toggle dropdown
    const handleTriggerClick = () => {
        if (disabled) return;
        setIsOpen(prev => !prev);
    };

    // Render dropdown content
    const renderContent = () => {
        if (children) {
            return children;
        }

        if (items) {
            return (
                <div className="py-1">
                    {items.map((item, index) => (
                        <DropdownItem
                            key={item.value}
                            item={item}
                            selected={isItemSelected(item.value)}
                            multiple={multiple}
                            onClick={() => handleItemSelect(item)}
                            focused={focusedIndex === index}
                            itemId={`${id}-option-${index}`}
                        />
                    ))}
                </div>
            );
        }

        return null;
    };

    return (
        <>
            {/* Trigger wrapper */}
            <div
                ref={triggerRef}
                onClick={handleTriggerClick}
                className={`${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${triggerClassName}`}
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-controls={`${id}-listbox`}
                aria-activedescendant={
                    isOpen && focusedIndex >= 0 && items
                        ? `${id}-option-${focusedIndex}`
                        : undefined
                }
                onKeyDown={(e) => {
                    if (disabled) return;
                    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                        e.preventDefault();
                        setIsOpen(true);
                    }
                }}
            >
                {trigger}
            </div>

            {/* Dropdown panel (portal) */}
            {isOpen &&
                calculatedPosition &&
                typeof window !== 'undefined' &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        id={`${id}-listbox`}
                        role="listbox"
                        aria-label="Options"
                        aria-multiselectable={multiple}
                        className={`fixed z-[1000001] card overflow-hidden animate-dropdown-in ${className}`}
                        style={{
                            top: calculatedPosition.isAbove
                                ? 'auto'
                                : calculatedPosition.top,
                            bottom: calculatedPosition.isAbove
                                ? window.innerHeight -
                                calculatedPosition.top +
                                offset
                                : 'auto',
                            left: calculatedPosition.left,
                            right: calculatedPosition.right,
                            width: calculatedPosition.width,
                            maxHeight: calculatedPosition.maxHeight,
                        }}
                    >
                        {/* Header slot */}
                        {header && (
                            <div className="flex-shrink-0 border-b border-border">
                                {header}
                            </div>
                        )}

                        {/* Main content */}
                        <div
                            className="overflow-y-auto"
                            style={{
                                maxHeight: calculatedPosition.maxHeight - (header ? 50 : 0) - (footer ? 50 : 0),
                            }}
                        >
                            {renderContent()}
                        </div>

                        {/* Footer slot */}
                        {footer && (
                            <div className="flex-shrink-0 border-t border-border">
                                {footer}
                            </div>
                        )}
                    </div>,
                    document.body
                )}
        </>
    );
}
