import React from 'react';

interface FormCheckboxProps {
  label: string | React.ReactNode;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  description?: string;
}

export default function FormCheckbox({
  label,
  name,
  checked,
  onChange,
  required = false,
  disabled = false,
  error,
  className = '',
  description,
}: FormCheckboxProps) {
  return (
    <div className={`form-group ${className}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            required={required}
            disabled={disabled}
            aria-describedby={
              description
                ? `${name}-description`
                : error
                  ? `${name}-error`
                  : undefined
            }
            className="form-checkbox"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor={name} className="form-checkbox-label">
            {label}
            {required && <span className="form-label-required">*</span>}
          </label>
          {description && (
            <p id={`${name}-description`} className="form-checkbox-description">
              {description}
            </p>
          )}
        </div>
      </div>
      {error && (
        <p id={`${name}-error`} className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
