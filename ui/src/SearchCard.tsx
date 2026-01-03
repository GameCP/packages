'use client';

import { ReactNode, useState } from 'react';
import { IconType } from 'react-icons';
import { RiSearchLine, RiRefreshLine, RiFilterLine } from 'react-icons/ri';
import SharedTooltip from './SharedTooltip';
import { SmartSelect } from './SmartDropdown';
import SmartDropdown from './SmartDropdown';
import FormInput from './FormInput';
import IconButtonWithCount from './IconButtonWithCount';
import { default as BaseActionButton } from './buttons/ActionButton';

interface SearchCardProps {
  title: string;
  count: number;
  total: number;
  actionButton?: ReactNode;
  children: ReactNode;
  className?: string;
  icon?: IconType;
  description?: string;
}

interface SearchCardHeaderProps {
  title: string;
  count: number;
  total: number;
  actionButton?: ReactNode;
  icon?: IconType;
  description?: string;
}

interface SearchCardContentProps {
  children: ReactNode;
  className?: string;
}

// Main search card container
export function SearchCard({
  title,
  count,
  total,
  actionButton,
  children,
  className = '',
  icon: Icon,
  description,
}: SearchCardProps) {
  return (
    <div className={`card p-4 lg:p-6 ${className}`}>
      <SearchCardHeader
        title={title}
        count={count}
        total={total}
        actionButton={actionButton}
        icon={Icon}
        description={description}
      />
      <SearchCardContent>{children}</SearchCardContent>
    </div>
  );
}

// Search card header with title, count, action button, icon, and description
export function SearchCardHeader({
  title,
  count,
  total,
  actionButton,
  icon: Icon,
  description,
}: SearchCardHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        {Icon && (
          <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-foreground flex-shrink-0" />
        )}
        <div className="min-w-0">
          <h2 className="text-lg lg:text-2xl font-bold  truncate">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground hidden md:block">
              {description}
            </p>
          )}
          <p className="mt-1 lg:mt-2 text-xs text-secondary-foreground">
            {count} of {total} {title.toLowerCase()}
          </p>
        </div>
      </div>

      {actionButton && (
        <div className="flex flex-row gap-2 lg:gap-3 flex-shrink-0">
          {actionButton}
        </div>
      )}
    </div>
  );
}

// Search card content area
export function SearchCardContent({
  children,
  className = '',
}: SearchCardContentProps) {
  return <div className={className}>{children}</div>;
}

// Search input component
export function SearchInput({
  placeholder,
  value,
  onChange,
  className = '',
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={`flex-1 ${className}`}>
      <FormInput
        label=""
        name="search"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        icon={{
          left: <RiSearchLine className="w-4 h-4 text-muted-foreground" />,
        }}
        className="mb-0"
      />
    </div>
  );
}

// Filter select component
export function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  className = '',
  multiple = false,
  searchable = true,
}: {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  placeholder: string;
  className?: string;
  multiple?: boolean;
  searchable?: boolean;
}) {
  return (
    <SmartSelect
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      className={`form-input form-input-md ${className}`}
      keepOpen={multiple}
      multiple={multiple}
      searchable={searchable}
    />
  );
}

// Action button component
export function ActionButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  title = '',
  hideTextOnMobile = false,
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  title?: string;
  hideTextOnMobile?: boolean;
}) {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}

// Refresh button component
export function RefreshButton({
  onClick,
  isLoading = false,
  className = '',
}: {
  onClick: () => void;
  isLoading?: boolean;
  className?: string;
}) {
  return (
    <BaseActionButton
      icon={RiRefreshLine}
      onClick={onClick}
      disabled={isLoading}
      loading={isLoading}
      iconOnly
      size="md"
      variant="secondary"
      tooltipId="refresh-button-tooltip"
      title="Refresh"
      tooltipPlace="top"
      className={`btn-alt ${className}`}
    />
  );
}

// Filter toggle button component
export function FilterToggleButton({
  isOpen,
  onClick,
  onClear,
  activeCount = 0,
  className = '',
}: {
  isOpen: boolean;
  onClick: () => void;
  onClear?: () => void;
  activeCount?: number;
  className?: string;
}) {
  const tooltipText =
    activeCount > 0
      ? `${activeCount} filter${activeCount === 1 ? '' : 's'} active`
      : 'Filters';

  return (
    <>
      <IconButtonWithCount
        icon={<RiFilterLine className="w-4 h-4" />}
        label="Filters"
        count={activeCount}
        onClick={onClick}
        onClear={onClear}
        className={className}
        tooltipId="filter-button-tooltip"
        tooltipContent={tooltipText}
        clearTooltipId="clear-filters-tooltip"
        clearTooltipContent="Clear all filters"
      />

      <SharedTooltip id="filter-button-tooltip" />
    </>
  );
}

// Mobile-friendly search layout component
export function MobileSearchLayout({
  searchInput,
  filters,
  viewControls,
  activeFilterCount = 0,
  onClearFilters,
  className = '',
  filterInline = false,
  searchButton,
}: {
  searchInput: ReactNode;
  filters: ReactNode;
  viewControls?: ReactNode;
  activeFilterCount?: number;
  onClearFilters?: () => void;
  className?: string;
  filterInline?: boolean;
  searchButton?: ReactNode;
}) {
  const [showFilters, setShowFilters] = useState(false);

  // Render inline filters on desktop, dropdown on mobile
  if (filterInline) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Search bar with view controls */}
        <div className="flex gap-2 items-center">
          <div className="flex-1">{searchInput}</div>
          <div className="flex gap-2 items-center">
            {/* Mobile dropdown button - hidden on lg+ */}
            <div className="lg:hidden">
              <SmartDropdown
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                width={600}
                maxHeight={320}
                trigger={
                  <FilterToggleButton
                    isOpen={showFilters}
                    onClick={() => setShowFilters(!showFilters)}
                    activeCount={activeFilterCount}
                    onClear={onClearFilters}
                  />
                }
              >
                <div className="">
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filters}
                    </div>
                  </div>
                </div>
              </SmartDropdown>
            </div>
            {viewControls && viewControls}
          </div>
        </div>

        {/* Inline filters below search - hidden on mobile, shown on lg+ */}
        <div className="hidden lg:flex lg:flex-col lg:gap-3">
          <div className="flex flex-col lg:flex-row gap-3">{filters}</div>
          {searchButton && (
            <div className="flex justify-end">{searchButton}</div>
          )}
        </div>

        {/* Tooltips */}
        <SharedTooltip id="clear-filters-tooltip" />
      </div>
    );
  }

  // Original dropdown filters (for non-inline mode)
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search bar with view controls */}
      <div className="flex gap-2 items-center">
        <div className="flex-1">{searchInput}</div>
        <div className="flex gap-2 items-center">
          <SmartDropdown
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            width={600}
            maxHeight={320}
            trigger={
              <FilterToggleButton
                isOpen={showFilters}
                onClick={() => setShowFilters(!showFilters)}
                activeCount={activeFilterCount}
                onClear={onClearFilters}
              />
            }
          >
            <div className="">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filters}
                </div>
              </div>
            </div>
          </SmartDropdown>
          {viewControls && viewControls}
        </div>
      </div>

      {/* Tooltips */}
      <SharedTooltip id="clear-filters-tooltip" />
    </div>
  );
}
