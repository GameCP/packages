'use client';

import React, { forwardRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/datepicker.css';
import { RiCalendarLine, RiCloseLine } from 'react-icons/ri';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onClear?: () => void;
  className?: string;
  placeholder?: string;
}

// Custom input component for the date picker
const CustomInput = forwardRef<
  HTMLButtonElement,
  {
    value?: string;
    onClick?: () => void;
    placeholder?: string;
    hasValue?: boolean;
  }
>(({ value, onClick, placeholder, hasValue }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className={`
            flex items-center gap-2 px-2.5 py-1.5 
            bg-background border border-border rounded-lg 
            text-xs font-medium
            hover:bg-muted/50 hover:border-primary/30
            focus:ring-2 focus:ring-primary/20 focus:outline-none
            transition-all duration-200
            ${hasValue ? 'text-foreground' : 'text-muted-foreground'}
        `}
    type="button"
  >
    <RiCalendarLine className="w-3.5 h-3.5" />
    <span className="whitespace-nowrap">
      {value || placeholder || 'Select date'}
    </span>
  </button>
));

CustomInput.displayName = 'CustomInput';

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
  className = '',
  placeholder = 'Filter by date',
}: DateRangePickerProps) {
  const hasDateFilter = startDate || endDate;

  // Create portal container on mount
  useEffect(() => {
    if (!document.getElementById('datepicker-portal')) {
      const portal = document.createElement('div');
      portal.id = 'datepicker-portal';
      // Ensure the portal itself sits on top of everything
      portal.style.position = 'absolute';
      portal.style.top = '0px';
      portal.style.left = '0px';
      portal.style.zIndex = '99999';
      document.body.appendChild(portal);
    }
  }, []);

  const formatDateRange = () => {
    if (startDate && endDate) {
      const start = startDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const end = endDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      return `${start} - ${end}`;
    }
    if (startDate) {
      return `From ${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    if (endDate) {
      return `Until ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    return '';
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(dates: [Date | null, Date | null]) => {
          const [start, end] = dates;
          onStartDateChange(start);
          onEndDateChange(end);
        }}
        customInput={
          <CustomInput
            placeholder={placeholder}
            hasValue={!!hasDateFilter}
            value={formatDateRange()}
          />
        }
        maxDate={new Date()}
        isClearable={false}
        dateFormat="MMM d, yyyy"
        popperClassName="datepicker-popper"
        calendarClassName="
                    !bg-popover !border !border-border !rounded-lg !shadow-xl
                    !font-sans !text-sm
                "
        dayClassName={() => `
                    !rounded-md hover:!bg-primary/10 
                    !text-foreground !font-medium
                `}
        wrapperClassName="inline-block"
        showPopperArrow={false}
        popperPlacement="bottom-start"
        portalId="datepicker-portal"
      />

      {hasDateFilter && onClear && (
        <button
          onClick={onClear}
          className="
                        p-1 rounded-md 
                        text-muted-foreground hover:text-foreground 
                        hover:bg-muted
                        transition-colors
                    "
          title="Clear date filter"
          type="button"
        >
          <RiCloseLine className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
