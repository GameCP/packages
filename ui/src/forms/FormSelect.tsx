import React from 'react';
import Select from '../dropdowns/presets/Select';

interface FormSelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: FormSelectOption[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  placeholder?: string;
  description?: string;
  clearable?: boolean;
}

export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  error,
  className = '',
  placeholder,
  description,
  clearable = true,
}: FormSelectProps) {
  const handleSelectChange = (selectedValue: string | string[]) => {
    // Create a synthetic event to maintain compatibility with existing onChange handlers
    const syntheticEvent = {
      target: {
        name,
        value: Array.isArray(selectedValue) ? selectedValue[0] : selectedValue,
      },
    } as React.ChangeEvent<HTMLSelectElement>;

    onChange(syntheticEvent);
  };

  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="form-label-required">*</span>}
      </label>
      <Select
        value={value}
        onChange={handleSelectChange}
        options={options}
        placeholder={placeholder || 'Select an option...'}
        className={`${error ? 'form-input-error' : ''}`}
        disabled={disabled}
        clearable={clearable}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

