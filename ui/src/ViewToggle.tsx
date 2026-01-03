'use client';

import { RiGridFill, RiListUnordered } from 'react-icons/ri';
import ActionButton from './buttons/ActionButton';

interface ViewToggleProps {
  currentView: 'cards' | 'list';
  onViewChange: (view: 'cards' | 'list') => void;
  className?: string;
}

export default function ViewToggle({
  currentView,
  onViewChange,
  className = '',
}: ViewToggleProps) {
  const toggleView = () => {
    onViewChange(currentView === 'cards' ? 'list' : 'cards');
  };

  return (
    <ActionButton
      icon={currentView === 'cards' ? RiGridFill : RiListUnordered}
      onClick={toggleView}
      iconOnly
      size="md"
      variant="secondary"
      tooltipId="view-toggle-tooltip"
      title={
        currentView === 'cards' ? 'Switch to List View' : 'Switch to Card View'
      }
      tooltipPlace="top"
      className={`btn-alt ${className}`}
    />
  );
}
