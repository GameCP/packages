'use client';

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import { RiErrorWarningLine } from 'react-icons/ri';

export interface ConfirmDialogOptions {
    title: string;
    message: string;
    confirmText: string;
    cancelText?: string;
    confirmButtonColor?: 'danger' | 'info' | 'success';
}

interface ConfirmDialogProps {
    isOpen: boolean;
    options: ConfirmDialogOptions;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({ isOpen, options, onConfirm, onCancel }: ConfirmDialogProps) {
    const { title, message, confirmText, cancelText = 'Cancel', confirmButtonColor = 'info' } = options;

    const getConfirmVariant = () => {
        switch (confirmButtonColor) {
            case 'danger':
                return 'danger' as const;
            case 'success':
                return 'primary' as const;
            case 'info':
            default:
                return 'primary' as const;
        }
    };

    const isDanger = confirmButtonColor === 'danger';

    return (
        <Modal isOpen={isOpen} onClose={onCancel} title="" className="max-w-md" footer={null}>
            <div className="flex flex-col items-center text-center py-4 px-2">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDanger ? 'bg-danger/10' : 'bg-info/10'}`}>
                    <RiErrorWarningLine className={`w-6 h-6 ${isDanger ? 'text-danger' : 'text-info'}`} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>

                {/* Message */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{message}</p>

                {/* Actions */}
                <div className="flex gap-3 w-full justify-center">
                    <Button variant="secondary" onClick={onCancel}>
                        {cancelText}
                    </Button>
                    <Button variant={getConfirmVariant()} onClick={onConfirm} autoFocus>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

/**
 * Hook to use confirmation dialogs
 * 
 * @example
 * ```tsx
 * const { confirm } = useConfirmDialog();
 * 
 * const handleDelete = async () => {
 *   const confirmed = await confirm({
 *     title: 'Delete Item',
 *     message: 'Are you sure you want to delete this item?',
 *     confirmText: 'Delete',
 *     confirmButtonColor: 'danger'
 *   });
 *   
 *   if (confirmed) {
 *     // Delete the item
 *   }
 * };
 * ```
 */
export function useConfirmDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmDialogOptions>({
        title: '',
        message: '',
        confirmText: 'Confirm',
    });
    const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

    const confirm = (opts: ConfirmDialogOptions): Promise<boolean> => {
        setOptions(opts);
        setIsOpen(true);

        return new Promise<boolean>((resolve) => {
            setResolver(() => resolve);
        });
    };

    const handleConfirm = () => {
        setIsOpen(false);
        if (resolver) {
            resolver(true);
            setResolver(null);
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        if (resolver) {
            resolver(false);
            setResolver(null);
        }
    };

    const dialog = (
        <ConfirmDialog
            isOpen={isOpen}
            options={options}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    );

    return { confirm, dialog };
}

export default ConfirmDialog;
