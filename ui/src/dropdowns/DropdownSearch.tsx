'use client';

import { useRef, useEffect } from 'react';
import { RiSearchLine } from 'react-icons/ri';

interface DropdownSearchProps {
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
    className?: string;
}

/**
 * Search input for dropdown headers
 * Auto-focuses when mounted
 */
export default function DropdownSearch({
    value = '',
    onChange,
    placeholder = 'Search...',
    autoFocus = true,
    className = '',
}: DropdownSearchProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus on mount
    useEffect(() => {
        if (autoFocus) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [autoFocus]);

    return (
        <div className={`p-2 ${className}`}>
            <div className="relative">
                <RiSearchLine className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="form-input text-sm pl-8 w-full"
                />
            </div>
        </div>
    );
}
