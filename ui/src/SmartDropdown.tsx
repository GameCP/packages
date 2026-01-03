'use client';

import { useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { RiCheckLine, RiCloseLine, RiLoader4Line } from 'react-icons/ri';
import { DropDownArrow } from './DropDown';
import { useKeyboardNavigation } from './useKeyboardNavigation';

interface SmartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: ReactNode;
  children: ReactNode | ((position: { isAbove: boolean }) => ReactNode);
  className?: string;
  width?: number | 'auto' | 'fit-content';
  maxHeight?: number;
  offset?: number;
  margin?: number;
  id?: string;
  position?:
  | 'auto'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-left-aligned'
  | 'bottom-left-aligned';
}

interface DropdownPosition {
  top: number;
  left: number | undefined;
  right: number | undefined;
  width: number;
  maxHeight: number;
  isAbove: boolean;
}

export default function SmartDropdown({
  isOpen,
  onClose,
  trigger,
  children,
  className = '',
  width = 384,
  maxHeight = 450,
  offset = 8,
  margin = 16,
  id = 'dropdown-listbox',
  position = 'auto',
}: SmartDropdownProps) {
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
    right: undefined,
    width: 0,
    maxHeight: 0,
    isAbove: false,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Calculate dropdown position and size
  const calculateDropdownPosition = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate available space in all directions
    const spaceAbove = triggerRect.top - margin;
    const spaceBelow = viewportHeight - triggerRect.bottom - margin;

    // Determine dropdown dimensions
    let calculatedWidth: number;

    if (width === 'fit-content') {
      // For fit-content, we'll measure the content after rendering
      calculatedWidth = triggerRect.width;
    } else if (width === 'auto') {
      calculatedWidth = triggerRect.width;
    } else if (typeof width === 'number') {
      calculatedWidth = Math.min(width, viewportWidth - margin * 2);
    } else {
      calculatedWidth = triggerRect.width;
    }
    const calculatedMaxHeight = Math.min(
      maxHeight,
      Math.max(spaceAbove, spaceBelow)
    );

    // Determine horizontal position based on position prop
    let left = triggerRect.left;
    let right: number | undefined = undefined;

    if (position === 'top-right' || position === 'bottom-right') {
      left = triggerRect.right - calculatedWidth;
    } else if (position === 'top-left' || position === 'bottom-left') {
      left = triggerRect.left;
    } else if (
      position === 'top-left-aligned' ||
      position === 'bottom-left-aligned'
    ) {
      // Position dropdown to the left with fully dynamic offset
      // Calculate how much space we have to the left of the trigger
      const availableLeftSpace = triggerRect.left - margin;
      // Use a percentage of available space for offset (e.g., 20% of available space)
      const dynamicOffset = Math.max(20, availableLeftSpace * 0.2);
      right = viewportWidth - triggerRect.left + dynamicOffset;
      left = 0; // Set to 0 instead of undefined
      // Ensure width is calculated properly for right positioning
      calculatedWidth = Math.min(
        calculatedWidth,
        triggerRect.left - dynamicOffset - margin
      );
    } else {
      // Auto positioning (existing logic)
      // If dropdown would overflow right edge, align to right of trigger
      if (left + calculatedWidth > viewportWidth - margin) {
        left = triggerRect.right - calculatedWidth;
      }
    }

    // If still overflowing left edge, clamp to margin
    if (left !== undefined && left < margin) {
      left = margin;
    }

    // Determine vertical position
    let top = triggerRect.bottom + offset;
    let finalMaxHeight = calculatedMaxHeight;
    let isAbove = false;

    // If there's more space above and dropdown would overflow below
    if (
      spaceAbove > spaceBelow &&
      top + calculatedMaxHeight > viewportHeight - margin
    ) {
      // Position above the trigger
      isAbove = true;
      top = triggerRect.top - calculatedMaxHeight - offset;
      finalMaxHeight = Math.min(calculatedMaxHeight, spaceAbove);

      // If still overflowing top, clamp to top margin
      if (top < margin) {
        top = margin;
        finalMaxHeight = triggerRect.top - margin - offset;
      }
    } else {
      // Position below the trigger
      finalMaxHeight = Math.min(calculatedMaxHeight, spaceBelow);

      // If overflowing bottom, clamp to bottom margin
      if (top + finalMaxHeight > viewportHeight - margin) {
        top = viewportHeight - margin - finalMaxHeight;
      }
    }

    // Override positioning based on position prop
    if (position === 'top-right') {
      left = triggerRect.right - calculatedWidth;
      top = triggerRect.top - offset;
      isAbove = true;
      finalMaxHeight = Math.min(maxHeight, spaceAbove);
    } else if (position === 'top-left') {
      left = triggerRect.left;
      top = triggerRect.top - offset;
      isAbove = true;
      finalMaxHeight = Math.min(maxHeight, spaceAbove);
    } else if (position === 'bottom-right') {
      left = triggerRect.right - calculatedWidth;
      top = triggerRect.bottom + offset;
      isAbove = false;
      finalMaxHeight = Math.min(maxHeight, spaceBelow);
    } else if (position === 'bottom-left') {
      left = triggerRect.left;
      top = triggerRect.bottom + offset;
      isAbove = false;
      finalMaxHeight = Math.min(maxHeight, spaceBelow);
    } else if (position === 'top-left-aligned') {
      right = viewportWidth - triggerRect.right;
      left = 0;
      top = triggerRect.top - offset;
      isAbove = true;
      finalMaxHeight = Math.min(maxHeight, spaceAbove);
    } else if (position === 'bottom-left-aligned') {
      right = viewportWidth - triggerRect.right;
      left = 0;
      top = triggerRect.bottom + offset;
      isAbove = false;
      finalMaxHeight = Math.min(maxHeight, spaceBelow);
    }

    setDropdownPosition({
      top,
      left,
      right,
      width: calculatedWidth,
      maxHeight: finalMaxHeight,
      isAbove,
    });
  }, [width, maxHeight, margin, offset, position]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is inside the dropdown or trigger
      const isInsideDropdown = dropdownRef.current?.contains(target);
      const isInsideTrigger = triggerRef.current?.contains(target);

      // Only close if click is truly outside
      if (!isInsideDropdown && !isInsideTrigger) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Calculate smart dropdown position when opening
  useEffect(() => {
    if (isOpen) {
      calculateDropdownPosition();
    }
  }, [isOpen, calculateDropdownPosition]);

  // Recalculate position on window resize and scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      calculateDropdownPosition();
    };

    const handleScroll = () => {
      calculateDropdownPosition();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true); // Use capture to catch all scroll events
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, calculateDropdownPosition]);

  // Adjust position after dropdown content is rendered (for above positioning)
  useEffect(() => {
    if (!isOpen || !dropdownRef.current || !triggerRef.current) return;

    // Only adjust if dropdown is positioned above
    if (dropdownPosition.isAbove) {
      const adjustPosition = () => {
        const dropdownRect = dropdownRef.current?.getBoundingClientRect();
        const triggerRect = triggerRef.current?.getBoundingClientRect();

        if (!dropdownRect || !triggerRect) return;

        // Calculate the actual height of the dropdown content
        const actualHeight = dropdownRect.height;

        // Reposition to align with the bottom of the trigger
        const newTop = triggerRect.top - actualHeight - offset;

        // Only update if the position would be different and within bounds
        if (newTop !== dropdownPosition.top && newTop >= margin) {
          setDropdownPosition(prev => ({
            ...prev,
            top: newTop,
          }));
        }
      };

      // Use ResizeObserver to watch for content changes
      const resizeObserver = new ResizeObserver(() => {
        // Small delay to ensure content is fully rendered
        setTimeout(adjustPosition, 0);
      });

      resizeObserver.observe(dropdownRef.current);

      // Also adjust immediately in case content is already rendered
      adjustPosition();

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [isOpen, dropdownPosition.isAbove, dropdownPosition.top, offset, margin]);

  return (
    <>
      <div
        ref={triggerRef}
        className="w-full"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="dropdown-listbox"
      >
        {trigger}
      </div>

      {isOpen &&
        typeof window !== 'undefined' &&
        createPortal(
          <div
            ref={dropdownRef}
            id={id}
            data-smart-dropdown
            role="listbox"
            aria-label="Dropdown options"
            className={`fixed z-[1000001] card overflow-hidden`}
            style={{
              top: dropdownPosition.top,
              ...(dropdownPosition.left !== undefined
                ? { left: dropdownPosition.left }
                : {}),
              ...(dropdownPosition.right !== undefined
                ? { right: dropdownPosition.right }
                : {}),
              width: width === 'fit-content' ? 'auto' : dropdownPosition.width,
              maxHeight: dropdownPosition.maxHeight,
            }}
            onClick={e => {
              // Prevent clicks inside the dropdown from bubbling up
              e.stopPropagation();
            }}
          >
            <div
              className={className ? className : 'overflow-y-auto'}
              style={{ maxHeight: dropdownPosition.maxHeight }}
            >
              {typeof children === 'function'
                ? children({ isAbove: dropdownPosition.isAbove })
                : children}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

// SmartSelect component interfaces
interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  metadata?: {
    isDefault?: boolean;
    args?: string[];
  };
}

interface SmartSelectProps {
  options: Option[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  className?: string;
  description?: string;
  disabled?: boolean;
  multiple?: boolean;
  width?: number;
  searchable?: boolean;
  keepOpen?: boolean;
  clearable?: boolean;
  // API integration props
  onOpen?: () => void;
  onClose?: () => void;
  onSearch?: (search: string) => void;
  isLoading?: boolean;
}

// SmartSelect component
export function SmartSelect({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  className = '',
  description,
  disabled = false,
  multiple = false,
  width,
  searchable = false,
  keepOpen = false,
  clearable = true,
  // API integration props
  onOpen,
  onClose,
  onSearch,
  isLoading = false,
}: SmartSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle both single and multiple selection
  const selectedValues = multiple
    ? (value as string[]) || []
    : [value as string];
  const selectedOptions = options.filter(opt =>
    selectedValues.includes(opt.value)
  );

  // Check if there's actually a selection (not empty)
  const hasSelection = multiple
    ? selectedValues.length > 0
    : (value as string) && (value as string) !== '';

  // Filter options based on search term
  const filteredOptions =
    searchable && searchTerm.trim()
      ? options.filter(
        option =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : options;

  // Use keyboard navigation hook
  const { focusedIndex, handleKeyDown, resetFocus } = useKeyboardNavigation({
    isOpen,
    optionsLength: filteredOptions.length,
    onSelect: index => handleSelect(filteredOptions[index].value),
    onClose: () => setIsOpen(false),
    onOpen: () => setIsOpen(true),
  });

  // Update display value when selection changes
  useEffect(() => {
    if (selectedOptions.length > 0) {
      if (multiple) {
        setDisplayValue(selectedOptions.map(opt => opt.label).join(', '));
      } else {
        setDisplayValue(selectedOptions[0].label);
      }
    } else {
      setDisplayValue('');
    }
  }, [selectedOptions, multiple]);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const currentValues = (value as string[]) || [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue) // Remove if already selected
        : [...currentValues, optionValue]; // Add if not selected

      onChange(newValues);
      // For multiple selection, keep dropdown open
    } else {
      onChange(optionValue);
      setSearchTerm('');
      // For single selection, close immediately
      setIsOpen(false);
    }
  };

  // Get the current trigger element
  const currentTriggerRef = searchable ? inputRef : buttonRef;

  // Measure trigger width when it mounts and when dropdown opens
  useEffect(() => {
    if (currentTriggerRef.current) {
      const rect = currentTriggerRef.current.getBoundingClientRect();
      setTriggerWidth(rect.width);
    }
  }, [isOpen, currentTriggerRef]); // Re-measure when dropdown opens

  // Add resize observer to handle window resizing
  useEffect(() => {
    if (!currentTriggerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (currentTriggerRef.current) {
        const rect = currentTriggerRef.current.getBoundingClientRect();
        setTriggerWidth(rect.width);
      }
    });

    resizeObserver.observe(currentTriggerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [currentTriggerRef]);

  // Focus input when dropdown opens and clear search when it closes
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      // Small delay to ensure the dropdown is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else if (!isOpen) {
      setSearchTerm('');
      resetFocus();
    }
  }, [isOpen, searchable, resetFocus]);

  // Handle API integration callbacks
  const handleOpen = () => {
    setIsOpen(true);
    onOpen?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    onSearch?.(search);
  };

  return (
    <div className="w-full" data-smart-select>
      {description && <p className="form-description">{description}</p>}
      <SmartDropdown
        isOpen={isOpen}
        onClose={handleClose}
        width={width !== undefined ? width : triggerWidth}
        maxHeight={200}
        trigger={
          searchable ? (
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={isOpen ? searchTerm : displayValue}
                onChange={e => {
                  if (isOpen) {
                    handleSearchChange(e.target.value);
                    resetFocus(); // Reset focus when searching
                  }
                }}
                onFocus={() => !disabled && handleOpen()}
                onClick={e => {
                  e.stopPropagation();
                  !disabled && handleOpen();
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-controls="dropdown-listbox"
                aria-autocomplete="list"
                aria-activedescendant={
                  focusedIndex >= 0 ? `option-${focusedIndex}` : undefined
                }
                className={`form-input truncate ${hasSelection ? 'pr-12' : 'pr-8'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
              />
              {/* Clear button - only show when there are selected values and clearable is true */}
              {hasSelection && clearable && (
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onChange(multiple ? [] : '');
                  }}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-muted-foreground transition-colors"
                  aria-label="Clear selection"
                  title="Clear selection"
                >
                  <RiCloseLine className="w-4 h-4" aria-hidden={true} />
                </button>
              )}
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  !disabled && setIsOpen(!isOpen);
                }}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-muted-foreground transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={disabled}
                aria-label={isOpen ? 'Close dropdown' : 'Open dropdown'}
                aria-expanded={isOpen}
              >
                <DropDownArrow
                  isOpen={isOpen}
                  disabled={disabled}
                  size="sm"
                  color="gray"
                  aria-hidden={true}
                />
              </button>
            </div>
          ) : (
            <div className="relative group">
              <button
                ref={buttonRef}
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  !disabled && (isOpen ? handleClose() : handleOpen());
                }}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-controls="dropdown-listbox"
                aria-label={placeholder}
                aria-activedescendant={
                  focusedIndex >= 0 ? `option-${focusedIndex}` : undefined
                }
                className={`form-input flex items-center justify-between text-left ${hasSelection ? 'pr-12' : 'pr-8'} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
              >
                <span
                  className={`flex items-center gap-2 min-w-0 flex-1 ${selectedOptions.length > 0 ? '' : 'text-muted-foreground opacity-60'}`}
                >
                  {multiple ? (
                    selectedOptions.length > 0 ? (
                      (() => {
                        const displayText = selectedOptions
                          .map(opt => opt.label)
                          .join(', ');
                        return (
                          <span className="flex items-center gap-1 min-w-0 flex-1">
                            {selectedOptions[0].icon && (
                              <span className="flex-shrink-0">
                                {selectedOptions[0].icon}
                              </span>
                            )}
                            <span className="truncate">{displayText}</span>
                          </span>
                        );
                      })()
                    ) : (
                      <span className="truncate">{placeholder}</span>
                    )
                  ) : selectedOptions[0] ? (
                    <span className="flex items-center gap-1 min-w-0 flex-1">
                      {selectedOptions[0].icon && (
                        <span className="flex-shrink-0">
                          {selectedOptions[0].icon}
                        </span>
                      )}
                      <span className="truncate">
                        {selectedOptions[0].label}
                      </span>
                    </span>
                  ) : (
                    <span className="truncate">{placeholder}</span>
                  )}
                </span>
              </button>
              {/* Clear button - only show when there are selected values and clearable is true */}
              {hasSelection && clearable && (
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onChange(multiple ? [] : '');
                  }}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-muted-foreground transition-all duration-200 opacity-0 group-hover:opacity-100"
                  aria-label="Clear selection"
                  title="Clear selection"
                >
                  <RiCloseLine className="w-4 h-4" aria-hidden={true} />
                </button>
              )}
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  !disabled && setIsOpen(!isOpen);
                }}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-muted-foreground transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={disabled}
                aria-label={isOpen ? 'Close dropdown' : 'Open dropdown'}
                aria-expanded={isOpen}
              >
                <DropDownArrow
                  isOpen={isOpen}
                  disabled={disabled}
                  size="sm"
                  color="gray"
                  aria-hidden={true}
                />
              </button>
            </div>
          )
        }
      >
        <div className="py-2">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <button
                key={option.value}
                id={`option-${index}`}
                type="button"
                role="option"
                aria-selected={selectedValues.includes(option.value)}
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelect(option.value);
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center justify-between min-h-[40px] transition-colors ${selectedValues.includes(option.value)
                  ? 'bg-accent border-l-2 border-l-ring'
                  : index === focusedIndex
                    ? 'bg-muted ring-2 ring-ring'
                    : ''
                  }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {option.icon && (
                    <span className="flex-shrink-0">{option.icon}</span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-foreground truncate">
                        {option.label}
                      </div>
                      {option.metadata?.isDefault && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium success-badge flex-shrink-0">
                          Default
                        </span>
                      )}
                    </div>
                    {option.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {option.description}
                      </div>
                    )}
                    {option.metadata?.args &&
                      option.metadata.args.length > 0 && (
                        <div className="mt-1">
                          <div className="text-xs text-secondary-foreground mb-1">
                            Arguments:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {option.metadata.args
                              .slice(0, 3)
                              .map((arg: string, argIndex: number) => (
                                <span
                                  key={argIndex}
                                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono bg-muted text-muted-foreground"
                                >
                                  {arg}
                                </span>
                              ))}
                            {option.metadata.args.length > 3 && (
                              <span className="text-xs text-secondary-foreground">
                                +{option.metadata.args.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
                {multiple ? (
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={() => { }} // Handled by button click
                    className="w-4 h-4 text-primary bg-muted border-border rounded focus:ring-primary focus:ring-2"
                  />
                ) : (
                  selectedValues.includes(option.value) && (
                    <RiCheckLine className="w-4 h-4 text-primary flex-shrink-0" />
                  )
                )}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-secondary-foreground flex items-center gap-2">
              {isLoading ? (
                <>
                  <RiLoader4Line className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : searchTerm.trim() ? (
                <span>No results found</span>
              ) : (
                <span>No options available</span>
              )}
            </div>
          )}
        </div>
      </SmartDropdown>
    </div>
  );
}
