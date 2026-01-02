'use client';

import { useEffect, ReactNode, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { RiCloseLine } from 'react-icons/ri';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  header?: ReactNode;
  blocking?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  footer?: ReactNode;
  fullScreen?: boolean;
  noPadding?: boolean;
  footerBg?: 'white' | 'gray';
  variant?: 'default' | 'plain';
  scrollable?: boolean;
  'aria-describedby'?: string;
  customStyles?: {
    container?: string;
    backdrop?: string;
    content?: string;
    header?: string;
    footer?: string;
  };
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-full mx-4',
};

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  header,
  blocking = false,
  size = 'md',
  className = '',
  footer,
  fullScreen = false,
  noPadding = false,
  footerBg = 'gray',
  variant = 'default',
  scrollable = true,
  'aria-describedby': ariaDescribedBy,
  customStyles = {},
}: ModalProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const hasPerformedInitialFocusRef = useRef(false);

  // Get all focusable elements within modal
  const getFocusableElements = (): HTMLElement[] => {
    if (!modalContentRef.current) return [];

    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(
      modalContentRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
    );
  };

  // Focus management
  useEffect(() => {
    if (!isOpen) {
      // Reset the flag when modal closes
      hasPerformedInitialFocusRef.current = false;
      return;
    }

    // Store the previously active element only on first open
    if (!hasPerformedInitialFocusRef.current) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;
    }

    let timeoutId: NodeJS.Timeout | null = null;

    // Only auto-focus the first element on initial open, not on every render
    if (!hasPerformedInitialFocusRef.current) {
      // Focus first focusable element in modal
      const focusableElements = getFocusableElements();
      const firstFocusable = focusableElements[0];

      // Small delay to ensure modal is rendered
      timeoutId = setTimeout(() => {
        // Only auto-focus if user is not currently typing in an input
        const activeElement = document.activeElement;
        const isHTMLElement = activeElement instanceof HTMLElement;
        const isUserTyping = activeElement && (
          activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          (isHTMLElement && activeElement.isContentEditable)
        );

        // Only focus if:
        // 1. User is not typing
        // 2. Current focus is not already inside the modal
        const isFocusInModal = modalContentRef.current?.contains(activeElement);
        if (!isUserTyping && !isFocusInModal) {
          if (firstFocusable) {
            firstFocusable.focus();
            hasPerformedInitialFocusRef.current = true;
          } else if (modalContentRef.current) {
            // If no focusable elements, focus the modal itself
            modalContentRef.current.focus();
            hasPerformedInitialFocusRef.current = true;
          }
        } else if (isFocusInModal) {
          // Focus is already in modal, mark as done
          hasPerformedInitialFocusRef.current = true;
        }
      }, 100);
    }

    // Handle Tab key for focus trapping
    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Handle ESC key press
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !blocking) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleTab);
    document.addEventListener('keydown', handleEsc);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      document.removeEventListener('keydown', handleTab);
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';

      // Restore focus to previously active element only on close
      if (!isOpen && previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isOpen, onClose, blocking]);

  // Get the existing modal root from layout, or create one if it doesn't exist
  const modalRoot = (() => {
    if (typeof document === 'undefined') return null;

    let root = document.getElementById('modal-root');
    if (!root) {
      // Create modal root if it doesn't exist
      root = document.createElement('div');
      root.id = 'modal-root';
      document.body.appendChild(root);
    }
    return root;
  })();

  if (!modalRoot) {
    return null;
  }

  // Animation variants
  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 100, // Slide down much further for reverse effect
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  };

  if (!isOpen) return null;

  // Plain variant renders as interstitial with internal controls
  if (variant === 'plain') {
    return createPortal(
      <AnimatePresence>
        <motion.div
          key="modal-backdrop"
          className={`modal-backdrop fixed inset-0 w-screen h-screen flex items-center ${customStyles.backdrop?.includes('justify-')
              ? customStyles.backdrop
              : customStyles.backdrop
                ? `${customStyles.backdrop} justify-center`
                : 'justify-center bg-black/10'
            } z-[999999] m-0 ${fullScreen ? 'p-0' : 'p-4'}`}
          variants={backdropVariants}
          initial="hidden"
          animate={isOpen ? 'visible' : 'hidden'}
          exit="hidden"
          onClick={blocking ? undefined : onClose}
        >
          <motion.div
            key="modal-content"
            ref={modalContentRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title-plain' : undefined}
            aria-describedby={ariaDescribedBy || 'modal-content-plain'}
            tabIndex={-1}
            className={`w-full flex flex-col overflow-hidden relative z-[1000000] ${customStyles.container || 'bg-card shadow-xl'
              } ${fullScreen
                ? 'h-full rounded-none'
                : `rounded-lg ${className} ${sizeClasses[size]} max-h-[90vh]`
              }`}
            variants={modalVariants}
            initial="hidden"
            animate={isOpen ? 'visible' : 'exit'}
            exit="exit"
            onClick={e => e.stopPropagation()}
          >
            {/* Content with internal controls */}
            <div
              id="modal-content-plain"
              className={`flex-1 ${customStyles.content || ''}`}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>,
      modalRoot
    );
  }

  // Default variant with header/footer structure
  return createPortal(
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        className={`modal-backdrop fixed inset-0 w-screen h-screen bg-black/10 flex items-center ${customStyles.backdrop || 'justify-center'
          } z-[999999] m-0 ${fullScreen ? 'p-0' : 'p-4'}`}
        variants={backdropVariants}
        initial="hidden"
        animate={isOpen ? 'visible' : 'hidden'}
        exit="hidden"
        onClick={blocking ? undefined : onClose}
      >
        <motion.div
          key="modal-content"
          ref={modalContentRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={ariaDescribedBy || 'modal-content'}
          tabIndex={-1}
          className={`bg-card border border-border shadow-xl w-full flex flex-col overflow-hidden relative z-[1000000] ${fullScreen
              ? 'h-full rounded-none'
              : `rounded-lg ${customStyles.container || className || sizeClasses[size]} max-h-[90vh]`
            }`}
          variants={modalVariants}
          initial="hidden"
          animate={isOpen ? 'visible' : 'exit'}
          exit="exit"
          onClick={e => e.stopPropagation()}
        >
          {/* Fixed Header */}
          {header ? (
            <div className="flex-shrink-0">{header}</div>
          ) : title ? (
            <div
              className={`px-6 py-4 border-b border-border flex justify-between items-center flex-shrink-0 ${customStyles.header || ''}`}
            >
              <h2
                id="modal-title"
                className="text-xl font-semibold text-foreground"
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                title="Close"
                aria-label="Close modal"
                disabled={blocking}
              >
                <RiCloseLine className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          ) : null}

          {/* Scrollable Content */}
          <div
            id="modal-content"
            className={`bg-background text-foreground flex-1 ${scrollable ? 'overflow-y-auto' : ''} ${fullScreen || noPadding ? 'p-0' : 'px-6 py-4'}`}
          >
            {children}
          </div>

          {/* Sticky Footer */}
          {footer && (
            <div
              className={`flex-shrink-0 px-6 py-4 border-t border-border ${footerBg === 'white' ? 'bg-card' : 'bg-muted'} ${customStyles.footer || ''}`}
            >
              {footer}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    modalRoot
  );
}
