'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { DropDownArrow } from '../../DropDown';
import DropdownItem from '../DropdownItem';
import type { DropdownItem as DropdownItemType } from '../types';

interface VariableInputProps {
    /** Current value */
    value: string | undefined;
    /** Change handler */
    onChange: (value: string | undefined) => void;
    /** Predefined variable options */
    options: DropdownItemType[];
    /** Placeholder text */
    placeholder?: string;
    /** Whether the input is read-only */
    readOnly?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Additional className */
    className?: string;
    /** Input className */
    inputClassName?: string;
}

interface DropdownPosition {
    top: number;
    left: number;
    width: number;
}

/**
 * VariableInput preset - input field with dropdown for predefined options
 * Used by PortEditor, VolumeEditor for variable selection
 */
export default function VariableInput({
    value,
    onChange,
    options,
    placeholder = 'Enter value...',
    readOnly = false,
    disabled = false,
    className = '',
    inputClassName = '',
}: VariableInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<DropdownPosition | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Calculate dropdown position
    const calculatePosition = useCallback(() => {
        if (!containerRef.current) return null;
        const rect = containerRef.current.getBoundingClientRect();
        return {
            top: rect.bottom + window.scrollY + 4,
            left: rect.left,
            width: rect.width,
        };
    }, []);

    // Update position when open
    useEffect(() => {
        if (isOpen) {
            setPosition(calculatePosition());
        }
    }, [isOpen, calculatePosition]);

    // Handle click outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
                inputRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Handle resize
    useEffect(() => {
        if (!isOpen) return;

        const handleResize = () => {
            setPosition(calculatePosition());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen, calculatePosition]);

    // Check if value is a predefined variable
    const isPredefinedVariable = options.some(opt => opt.value === value);

    // Handle input change (manual typing)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value || undefined);
    };

    // Handle option select
    const handleSelectOption = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        inputRef.current?.focus();
    };

    // Toggle dropdown
    const handleToggle = () => {
        if (!disabled && !readOnly) {
            setIsOpen(prev => !prev);
        }
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <div className="flex">
                <input
                    ref={inputRef}
                    type="text"
                    value={value || ''}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    readOnly={readOnly || isPredefinedVariable}
                    disabled={disabled}
                    className={`
            form-input text-sm flex-1 pr-8
            ${isPredefinedVariable ? 'bg-muted font-medium text-primary' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${inputClassName}
          `}
                />
                {!readOnly && (
                    <button
                        type="button"
                        onClick={handleToggle}
                        disabled={disabled}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 hover:bg-muted/50 rounded"
                        tabIndex={-1}
                    >
                        <DropDownArrow
                            isOpen={isOpen}
                            disabled={disabled}
                            size="sm"
                            color="gray"
                        />
                    </button>
                )}
            </div>

            {/* Dropdown portal */}
            {isOpen &&
                position &&
                typeof window !== 'undefined' &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        className="fixed z-[1000001] card overflow-hidden animate-dropdown-in max-h-64 overflow-y-auto"
                        style={{
                            top: position.top,
                            left: position.left,
                            width: position.width,
                        }}
                    >
                        <div className="py-1">
                            {options.map(option => (
                                <DropdownItem
                                    key={option.value}
                                    item={option}
                                    selected={value === option.value}
                                    onClick={() => handleSelectOption(option.value)}
                                />
                            ))}
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
}
