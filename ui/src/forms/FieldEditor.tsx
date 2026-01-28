'use client';

import React, { useState, useEffect } from 'react';
import {
  RiAddLine,
  RiDeleteBinLine,
  RiSaveLine,
  RiCloseLine,
  RiSettings3Line,
} from 'react-icons/ri';
import FormInput from './FormInput';

interface FieldOption {
  name: string;
  value: string;
}

interface Tool {
  name: string;
  label: string;
  component: any;
  supportedTypes: (
    | 'text'
    | 'textarea'
    | 'number'
    | 'checkbox'
    | 'select'
    | 'password'
  )[];
}

// Tools lookup mapping tool names to their supported input types
export const TOOLS_LOOKUP: Record<string, Tool> = {
  motdGenerator: {
    name: 'motdGenerator',
    label: 'MOTD Generator',
    component: () => import('@/components/tools/MotdGenerator'),
    supportedTypes: ['text', 'textarea'],
  },
};

interface FieldEditorProps {
  field: {
    key: string;
    displayName?: string;
    description?: string;
    inputType?:
    | 'text'
    | 'textarea'
    | 'number'
    | 'checkbox'
    | 'select'
    | 'password';
    defaultValue?: string;
    placeholder?: string;
    required?: boolean;
    userEditable?: boolean;
    options?: FieldOption[];
    multiSelect?: boolean;
    allowExceedMax?: boolean;
    showOnDashboard?: boolean;
    generatePassword?: boolean;
    minValue?: number;
    maxValue?: number;
    tool?: string; // Tool name associated with this field
  };
  onSave: (field: any) => void;
  onCancel: () => void;
  title?: string;
  showUserEditable?: boolean;
  modalMode?: boolean;
  onFormDataChange?: (formData: any) => void;
  environmentVars?: Record<string, any>; // Environment variables for variable selector
}

function SelectOptionsEditor({
  options,
  onChange,
}: {
  options: FieldOption[];
  onChange: (options: FieldOption[]) => void;
}) {
  const addOption = () => {
    onChange([...options, { name: '', value: '' }]);
  };

  const updateOption = (
    index: number,
    field: 'name' | 'value',
    value: string
  ) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onChange(newOptions);
  };

  const removeOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Select Options
        </label>
        <button
          type="button"
          onClick={addOption}
          className="text-sm text-primary hover:opacity-80 flex items-center"
        >
          <RiAddLine className="w-4 h-4 mr-1" />
          Add Option
        </button>
      </div>

      {options.length > 0 && (
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex-1">
                <FormInput
                  label=""
                  name={`option-name-${index}`}
                  type="text"
                  value={option.name}
                  onChange={e => updateOption(index, 'name', e.target.value)}
                  placeholder="Display Name"
                  inputClassName="text-sm"
                />
              </div>
              <div className="flex-1">
                <FormInput
                  label=""
                  name={`option-value-${index}`}
                  type="text"
                  value={option.value}
                  onChange={e => updateOption(index, 'value', e.target.value)}
                  placeholder="Value"
                  inputClassName="text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="text-danger hover:text-danger"
              >
                <RiDeleteBinLine className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FieldEditor({
  field,
  onSave,
  onCancel,
  title = 'Edit Field',
  showUserEditable = true,
  modalMode = false,
  onFormDataChange,
  environmentVars = {},
}: FieldEditorProps) {
  const [formData, setFormData] = useState({
    key: field.key || '',
    displayName: field.displayName || '',
    description: field.description || '',
    inputType: field.inputType || 'text',
    defaultValue: field.defaultValue || '',
    placeholder: field.placeholder || '',
    required: field.required || false,
    userEditable: field.userEditable || false,
    options: field.options || [],
    multiSelect: field.multiSelect || false,
    allowExceedMax: field.allowExceedMax || false,
    showOnDashboard: field.showOnDashboard || false,
    generatePassword: field.generatePassword || false,
    minValue: field.minValue || undefined,
    maxValue: field.maxValue || undefined,
    tool: field.tool || '',
  });

  // Update form data when field prop changes (for split-pane view)
  // Only reset when selecting a DIFFERENT field (key changes), not on every render
  useEffect(() => {
    const newFormData = {
      key: field.key || '',
      displayName: field.displayName || '',
      description: field.description || '',
      inputType: field.inputType || 'text',
      defaultValue: field.defaultValue || '',
      placeholder: field.placeholder || '',
      required: field.required || false,
      userEditable: field.userEditable || false,
      options: field.options || [],
      multiSelect: field.multiSelect || false,
      allowExceedMax: field.allowExceedMax || false,
      showOnDashboard: field.showOnDashboard || false,
      generatePassword: field.generatePassword || false,
      minValue: field.minValue || undefined,
      maxValue: field.maxValue || undefined,
      tool: field.tool || '',
    };
    setFormData(newFormData);
    // Also notify parent immediately so Save button works right away
    if (modalMode && onFormDataChange) {
      onFormDataChange(newFormData);
    }
  }, [field.key]); // Only reset when selecting a different variable

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // If input type changed, clear the tool if it's no longer compatible
      if (field === 'inputType' && prev.tool) {
        const tool = TOOLS_LOOKUP[prev.tool];
        if (tool && !tool.supportedTypes.includes(value)) {
          newData.tool = '';
        }
      }

      return newData;
    });
  };

  // Notify parent of form data changes when in modal mode
  useEffect(() => {
    if (modalMode && onFormDataChange) {
      onFormDataChange(formData);
    }
  }, [formData, modalMode, onFormDataChange]);

  const inputTypeOptions = [
    { value: 'text', label: 'Text' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'number', label: 'Number' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'select', label: 'Select' },
    { value: 'password', label: 'Password' },
  ];

  // Get available tools for the current input type
  const getAvailableTools = () => {
    const availableTools = Object.entries(TOOLS_LOOKUP)
      .filter(([_, tool]) => tool.supportedTypes.includes(formData.inputType))
      .map(([key, tool]) => ({ value: key, label: tool.label }));

    return [{ value: '', label: 'No Tool' }, ...availableTools];
  };

  const toolOptions = getAvailableTools();

  return (
    <div
      className={
        modalMode ? 'space-y-4' : 'bg-card border border-border rounded-lg p-6'
      }
    >
      {/* Header - only show if not in modal mode */}
      {!modalMode && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium  flex items-center">
            <RiSettings3Line className="w-5 h-5 mr-2" />
            {title}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onSave(formData)}
              className="p-2 text-success hover:text-success hover:bg-success/10 rounded"
              title="Save changes"
            >
              <RiSaveLine className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="p-2 text-muted-foreground hover:text-muted-foreground hover:bg-muted rounded"
              title="Cancel"
            >
              <RiCloseLine className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Identity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FormInput
            label="Display Name"
            name="displayName"
            type="text"
            value={formData.displayName}
            onChange={e => updateField('displayName', e.target.value)}
            placeholder="User-friendly name"
            required
          />
          <FormInput
            label="Field Key"
            name="key"
            type="text"
            value={formData.key}
            onChange={e => updateField('key', e.target.value)}
            placeholder="field_key"
            required
          />

          {/* Description - Full Width */}
          <div className="lg:col-span-2">
            <FormInput
              label="Description"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={e => updateField('description', e.target.value)}
              placeholder="Field description (optional)"
              rows={2}
            />
          </div>
        </div>

        <div className="border-t border-border"></div>

        {/* Configuration Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input Type */}
          <FormInput
            label="Input Type"
            name="inputType"
            type="select"
            value={formData.inputType}
            onChange={e => updateField('inputType', e.target.value)}
            options={inputTypeOptions}
            placeholder="Select input type..."
          />

          {/* Tool Selection */}
          {toolOptions.length > 1 && (
            <FormInput
              label="Associated Tool"
              name="tool"
              type="select"
              value={formData.tool}
              onChange={e => updateField('tool', e.target.value)}
              options={toolOptions}
              placeholder="Select a tool..."
            />
          )}

          {/* Default Value */}
          <FormInput
            label="Default Value"
            name="defaultValue"
            value={formData.defaultValue}
            onChange={e => updateField('defaultValue', e.target.value)}
            placeholder="Default value"
            variablePicker={{ mode: 'environment', environmentVars }}
          />

          {/* Placeholder */}
          <FormInput
            label="Placeholder"
            name="placeholder"
            type="text"
            value={formData.placeholder}
            onChange={e => updateField('placeholder', e.target.value)}
            placeholder="Placeholder text"
          />

          {/* Min/Max Value fields - only for number input type */}
          {formData.inputType === 'number' && (
            <>
              <FormInput
                label="Minimum Value"
                name="minValue"
                type="number"
                value={formData.minValue || ''}
                onChange={e =>
                  updateField(
                    'minValue',
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                placeholder="Minimum value"
              />
              <FormInput
                label="Maximum Value"
                name="maxValue"
                type="number"
                value={formData.maxValue || ''}
                onChange={e =>
                  updateField(
                    'maxValue',
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                placeholder="Maximum value"
              />
            </>
          )}
        </div>

        {/* Select Options */}
        {formData.inputType === 'select' && (
          <div className="border-t border-border pt-6">
            <SelectOptionsEditor
              options={formData.options}
              onChange={options => updateField('options', options)}
            />
            {/* Multi-Select inside the select options section */}
            <div className="mt-4">
              <FormInput
                label="Allow Multiple Selections"
                name="multiSelect"
                type="checkbox"
                value={formData.multiSelect}
                onChange={e =>
                  updateField(
                    'multiSelect',
                    (e.target as HTMLInputElement).checked
                  )
                }
              />
            </div>
          </div>
        )}

        <div className="border-t border-border"></div>

        {/* Settings Section - Toggles */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
            Field Settings
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Required Field"
              description="User must provide a value"
              name="required"
              type="checkbox"
              value={formData.required}
              onChange={e =>
                updateField('required', (e.target as HTMLInputElement).checked)
              }
            />

            {showUserEditable && (
              <FormInput
                label="User Editable"
                description="Allow users to modify this value"
                name="userEditable"
                type="checkbox"
                value={formData.userEditable}
                onChange={e =>
                  updateField(
                    'userEditable',
                    (e.target as HTMLInputElement).checked
                  )
                }
              />
            )}

            <FormInput
              label="Show on Dashboard"
              description="Visible on the main server dashboard"
              name="showOnDashboard"
              type="checkbox"
              value={formData.showOnDashboard}
              onChange={e =>
                updateField(
                  'showOnDashboard',
                  (e.target as HTMLInputElement).checked
                )
              }
            />

            {/* Generate Password - only for password input type */}
            {formData.inputType === 'password' && (
              <FormInput
                label="Allow Auto-Generate"
                description="Show a button to generate a secure password"
                name="generatePassword"
                type="checkbox"
                value={formData.generatePassword}
                onChange={e =>
                  updateField(
                    'generatePassword',
                    (e.target as HTMLInputElement).checked
                  )
                }
              />
            )}

            {/* Allow Exceed Max - only for number input type */}
            {formData.inputType === 'number' && (
              <FormInput
                label="Exceed Maximum"
                description="Allow users to exceed the maximum value"
                name="allowExceedMax"
                type="checkbox"
                value={formData.allowExceedMax}
                onChange={e =>
                  updateField(
                    'allowExceedMax',
                    (e.target as HTMLInputElement).checked
                  )
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
