'use client';

import { useState, useRef, useEffect } from 'react';
import {
  RiCodeLine,
  RiServerLine,
  RiGamepadLine,
  RiSettings3Line,
  RiWifiLine,
  RiAddLine,
  RiSearchLine,
  RiLeafLine,
  RiShieldLine,
} from 'react-icons/ri';
import SharedTooltip from './SharedTooltip';
import FormInput from './forms/FormInput';
import { DropDownArrow } from './DropDown';
import {
  PREDEFINED_VARIABLES,
  formatVariableForDisplay,
} from './lib/variableSubstitution.client';
import Dropdown from './dropdowns/Dropdown';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';

// Unified variable types
export interface VariableItem {
  key: string;
  name: string;
  description: string;
  example: string;
  category:
  | 'server'
  | 'network'
  | 'game'
  | 'system'
  | 'field'
  | 'environment'
  | 'admin';
  type?: 'predefined' | 'field' | 'environment' | 'admin';
}

// Convert predefined variables to unified format
function convertPredefinedVariables(): VariableItem[] {
  return PREDEFINED_VARIABLES.map(variable => ({
    ...variable,
    type: 'predefined' as const,
  }));
}

// Convert form fields to unified format
function convertFormFields(fields: any[]): VariableItem[] {
  return fields.map(field => ({
    key: field.key,
    name:
      field.displayName ||
      field.key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
    description: field.description || 'Form field variable',
    example: field.defaultValue || 'example',
    category: 'field' as const,
    type: 'field' as const,
  }));
}

// Convert environment variables to unified format
function convertEnvironmentVariables(
  environmentVars: Record<string, any>
): VariableItem[] {
  if (!environmentVars || Object.keys(environmentVars).length === 0) {
    return [];
  }

  return Object.entries(environmentVars).map(([key, envVar]) => {
    const envConfig =
      typeof envVar === 'object' && envVar !== null
        ? envVar
        : { value: envVar };
    return {
      key,
      name:
        envConfig.displayName ||
        key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description:
        envConfig.description || 'Environment variable from game template',
      example: envConfig.value || 'example',
      category: 'environment' as const,
      type: 'environment' as const,
    };
  });
}

// Convert admin environment variables to unified format
function convertAdminEnvironmentVariables(
  adminEnvironmentVars: Record<string, any>
): VariableItem[] {
  if (!adminEnvironmentVars || Object.keys(adminEnvironmentVars).length === 0) {
    return [];
  }

  return Object.entries(adminEnvironmentVars).map(([key, adminVar]) => {
    const adminConfig =
      typeof adminVar === 'object' && adminVar !== null
        ? adminVar
        : { value: adminVar };
    return {
      key,
      name:
        adminConfig.displayName ||
        key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: adminConfig.description || 'Admin environment variable',
      example: adminConfig.value || 'example',
      category: 'admin' as const,
      type: 'admin' as const,
    };
  });
}

interface VariableSelectorProps {
  onSelectVariable: (variable: VariableItem) => void;
  className?: string;
  buttonText?: string;
  buttonClassName?: string;
  buttonTitle?: string; // Tooltip text for the button
  tooltipId?: string; // ID for SharedTooltip
  // New unified props
  mode?: 'predefined' | 'fields' | 'both' | 'environment' | 'admin' | 'all'; // What variables to show
  fields?: any[]; // Form fields for 'fields' or 'both' mode
  environmentVars?: Record<string, any>; // Environment variables for 'environment' or 'all' mode
  adminEnvironmentVars?: Record<string, any>; // Admin environment variables for 'admin' or 'all' mode
  showSearch?: boolean;
  showCategories?: boolean;
  placeholder?: string;
}

export default function VariableSelector({
  onSelectVariable,
  className = '',
  buttonText = 'Insert Variable',
  buttonClassName = '',
  buttonTitle = 'Insert Variable',
  tooltipId,
  mode = 'predefined',
  fields = [],
  environmentVars = {},
  adminEnvironmentVars = {},
  showSearch = true,
  showCategories = true,
  placeholder = 'Search variables...',
}: VariableSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('network');
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get variables based on mode
  const getVariables = (): VariableItem[] => {
    switch (mode) {
      case 'predefined':
        return convertPredefinedVariables();
      case 'fields':
        return convertFormFields(fields);
      case 'environment':
        return convertEnvironmentVariables(environmentVars);
      case 'admin':
        return convertAdminEnvironmentVariables(adminEnvironmentVars);
      case 'both':
        return [...convertPredefinedVariables(), ...convertFormFields(fields)];
      case 'all':
        return [
          ...convertPredefinedVariables(),
          ...convertFormFields(fields),
          ...convertEnvironmentVariables(environmentVars),
          ...convertAdminEnvironmentVariables(adminEnvironmentVars),
        ];
      default:
        return convertPredefinedVariables();
    }
  };

  const allVariables = getVariables();
  const variablesByCategory = allVariables.reduce(
    (acc, variable) => {
      if (!acc[variable.category]) {
        acc[variable.category] = [];
      }
      acc[variable.category].push(variable);
      return acc;
    },
    {} as Record<string, VariableItem[]>
  );

  const categories = Object.keys(variablesByCategory);

  // Set default category based on available categories
  useEffect(() => {
    if (categories.length > 0) {
      if (mode === 'fields' && categories.includes('field')) {
        setSelectedCategory('field');
      } else if (!categories.includes(selectedCategory)) {
        setSelectedCategory(categories[0]);
      }
    }
  }, [mode, categories.length]);

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Small delay to ensure the dropdown is rendered
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSelectVariable = (variable: VariableItem) => {
    onSelectVariable(variable);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Filter variables based on search term and selected category
  const filteredVariables = (
    showCategories ? variablesByCategory[selectedCategory] || [] : allVariables
  ).filter(
    variable =>
      variable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variable.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variable.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Use keyboard navigation hook
  const { focusedIndex, handleKeyDown, resetFocus } = useKeyboardNavigation({
    isOpen,
    optionsLength: filteredVariables.length,
    onSelect: index => {
      const variable = filteredVariables[index];
      if (variable) {
        handleSelectVariable(variable);
      }
    },
    onClose: () => setIsOpen(false),
    onOpen: () => setIsOpen(true),
  });

  const getCategoryIcon = (category: string, isActive: boolean) => {
    const iconClassName = isActive ? 'w-4 h-4' : 'w-4 h-4';
    switch (category) {
      case 'network':
        return <RiWifiLine className={iconClassName} />;
      case 'server':
        return <RiServerLine className={iconClassName} />;
      case 'game':
        return <RiGamepadLine className={iconClassName} />;
      case 'system':
        return <RiSettings3Line className={iconClassName} />;
      case 'field':
        return <RiCodeLine className={iconClassName} />;
      case 'environment':
        return <RiLeafLine className={iconClassName} />;
      case 'admin':
        return <RiShieldLine className={iconClassName} />;
      default:
        return <RiCodeLine className={iconClassName} />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'network':
        return 'Network';
      case 'server':
        return 'Server';
      case 'game':
        return 'Game';
      case 'system':
        return 'System';
      case 'field':
        return 'Form Fields';
      case 'environment':
        return 'Environment';
      case 'admin':
        return 'Admin';
      default:
        return category;
    }
  };

  return (
    <div className={className}>
      <Dropdown
        trigger={
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls="variable-selector-listbox"
            aria-label="Select variable"
            className={
              buttonClassName ||
              `inline-flex items-center px-3 py-2 text-sm font-medium text-secondary-foreground bg-background border border-input rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring`
            }
            title={!tooltipId ? buttonTitle : undefined}
            data-tooltip-id={tooltipId}
          >
            {buttonText ? (
              <>
                <RiCodeLine className="w-4 h-4 mr-2" />
                {buttonText}
                <DropDownArrow isOpen={isOpen} size="sm" color="gray" />
              </>
            ) : (
              <RiSettings3Line className="w-4 h-4" />
            )}
          </button>
        }
        className="flex flex-col max-h-96 overflow-hidden"
        id="variable-selector-listbox"
      >
        {/* Search Bar */}
        {showSearch && (
          <div className="flex-shrink-0 p-2 border-b border-border">
            <FormInput
              label=""
              name="search"
              type="text"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                resetFocus(); // Reset focus when searching
              }}
              placeholder={placeholder}
              icon={{
                left: (
                  <RiSearchLine className="w-3 h-3 text-muted-foreground" />
                ),
              }}
              className="mb-0"
              inputClassName="text-xs py-1.5 placeholder:text-muted-foreground"

            />
          </div>
        )}

        {/* Category Tabs */}
        {showCategories && categories.length > 1 && (
          <div className="flex-shrink-0 flex border-b border-border">
            {categories.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setSelectedCategory(category);
                  setSearchTerm('');
                }}
                className={`flex-1 px-2 py-1.5 text-xs font-medium border-b-2 transition-colors flex items-center justify-center gap-1 ${selectedCategory === category
                  ? 'border-ring text-foreground bg-muted'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                data-tooltip-id={`category-${category}`}
                data-tooltip-content={getCategoryLabel(category)}
              >
                {getCategoryIcon(category, selectedCategory === category)}
              </button>
            ))}
          </div>
        )}

        {/* Category Tooltips */}
        {showCategories && categories.length > 1 && (
          <>
            {categories.map(category => (
              <SharedTooltip
                key={`tooltip-${category}`}
                id={`category-${category}`}
                place="bottom"
                className="z-50"
              />
            ))}
          </>
        )}

        {/* Variables List */}
        <div className="flex-1 overflow-y-auto min-h-0 max-h-64">
          {filteredVariables.length > 0 ? (
            filteredVariables.map((variable, index) => (
              <button
                key={variable.key}
                id={`variable-option-${index}`}
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => handleSelectVariable(variable)}
                className={`w-full px-3 py-1.5 text-left hover:bg-muted/50 border-b border-border last:border-b-0 transition-colors ${index === focusedIndex ? 'bg-muted/50' : ''
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-secondary-foreground bg-secondary px-1.5 py-0.5 rounded border border-input">
                        {formatVariableForDisplay(variable.key)}
                      </code>
                      <span className="text-xs font-medium text-foreground">
                        {variable.name}
                      </span>
                      {variable.type === 'field' && (
                        <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border">
                          Field
                        </span>
                      )}
                      {variable.type === 'environment' && (
                        <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-accent text-accent-foreground border border-border">
                          Env
                        </span>
                      )}
                      {variable.type === 'admin' && (
                        <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-secondary-foreground line-clamp-1">
                      {variable.description}
                    </p>
                    <div className="mt-0.5 flex items-center text-[8px] text-muted-foreground">
                      <span>Example: </span>
                      <code className="ml-1 font-mono">{variable.example}</code>
                    </div>
                  </div>
                  <RiAddLine className="w-3 h-3 text-muted-foreground ml-2 flex-shrink-0" />
                </div>
              </button>
            ))
          ) : (
            <div className="px-3 py-6 text-center text-secondary-foreground">
              <RiSearchLine className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs">No variables found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try a different search term
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-3 py-1.5 bg-accent border-t border-border text-xs text-accent-foreground">
          Variables are substituted when the game server is created
        </div>
      </Dropdown>
      {tooltipId && (
        <SharedTooltip id={tooltipId} place="bottom">
          {buttonTitle}
        </SharedTooltip>
      )}
    </div>
  );
}

interface VariableInputProps {
  name?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  autoFocus?: boolean;
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  description?: string | React.ReactNode;
  footerDescription?: string | React.ReactNode;
  // New unified props
  mode?: 'predefined' | 'fields' | 'both' | 'environment' | 'admin' | 'all';
  fields?: any[];
  environmentVars?: Record<string, any>;
  adminEnvironmentVars?: Record<string, any>;
}

export function VariableInput({
  name,
  label,
  value,
  onChange,
  placeholder,
  error,
  className = '',
  autoFocus,
  onKeyDown,
  multiline = false,
  rows = 4,
  disabled = false,
  description,
  footerDescription,
  mode = 'predefined',
  fields = [],
  environmentVars = {},
  adminEnvironmentVars = {},
}: VariableInputProps) {
  // Clean up malformed variables (multiple nested ${})
  const cleanValue = (inputValue: string) => {
    // Replace multiple nested ${} with single ${}
    return inputValue.replace(/\$\{(\$\{)*([^}]+)(\})*\}/g, '${$2}');
  };

  // Clean the value when it changes
  const handleChange = (newValue: string) => {
    const cleanedValue = cleanValue(newValue);
    if (cleanedValue !== newValue) {
      console.warn('Cleaned malformed variable:', newValue, '->', cleanedValue);
    }
    onChange(cleanedValue);
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertVariable = (variable: VariableItem) => {
    const element = multiline ? textareaRef.current : inputRef.current;
    if (!element) return;

    const start = element.selectionStart || 0;
    const end = element.selectionEnd || 0;
    const variableText = formatVariableForDisplay(variable.key);

    // Prevent double insertion by checking if the variable is already there
    const currentText = value.slice(start, end);
    if (currentText === variableText) {
      return; // Don't insert if it's already there
    }

    // Check if cursor is inside an existing variable (between ${ and })
    const beforeCursor = value.slice(0, start);
    const afterCursor = value.slice(end);

    // Look for unclosed ${ before cursor
    const openBraces = (beforeCursor.match(/\$\{/g) || []).length;
    const closeBraces = (beforeCursor.match(/\}/g) || []).length;

    if (openBraces > closeBraces) {
      // Cursor is inside an existing variable, don't insert
      console.warn('Cursor is inside existing variable, skipping insertion');
      return;
    }

    const newValue = value.slice(0, start) + variableText + value.slice(end);
    onChange(newValue);

    // Set cursor position after the inserted variable
    setTimeout(() => {
      const newPosition = start + variableText.length;
      element.setSelectionRange(newPosition, newPosition);
      element.focus();
    }, 0);
  };

  const id = name || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      {description && <p className="form-description">{description}</p>}
      <div className="relative">
        {multiline ? (
          <textarea
            ref={textareaRef}
            id={id}
            name={name}
            value={value}
            onChange={e => handleChange(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            onKeyDown={onKeyDown}
            rows={rows}
            disabled={disabled}
            className={`form-input pr-10 ${error ? 'form-input-error' : ''}`}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            id={id}
            name={name}
            value={value}
            onChange={e => handleChange(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            onKeyDown={onKeyDown}
            disabled={disabled}
            className={`form-input pr-10 ${error ? 'form-input-error' : ''}`}
          />
        )}
        <VariableSelector
          onSelectVariable={insertVariable}
          buttonText=""
          className={`absolute ${multiline ? 'right-2 top-2' : 'right-1 top-1/2 -translate-y-1/2'}`}
          buttonClassName="p-1 text-muted-foreground hover:text-secondary-foreground bg-transparent border-0 shadow-none hover:bg-accent rounded"
          mode={mode}
          fields={fields}
          environmentVars={environmentVars}
          adminEnvironmentVars={adminEnvironmentVars}
          showSearch={true}
          showCategories={
            mode === 'predefined' ||
            mode === 'both' ||
            mode === 'environment' ||
            mode === 'admin' ||
            mode === 'all'
          }
          placeholder="Search variables..."
        />
      </div>
      {footerDescription && (
        <p className="text-xs text-secondary-foreground mt-1">
          {footerDescription}
        </p>
      )}
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}
