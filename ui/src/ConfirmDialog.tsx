'use client';

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';

export interface ConfirmDialogOptions {
    title: string;
    message: string;
    confirmText: string;
    cancelText?: string;
    confirmButtonColor?: 'red' | 'blue' | 'green';
}

interface ConfirmDialogProps {
    isOpen: boolean;
    options: ConfirmDialogOptions;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({ isOpen, options, onConfirm, onCancel }: ConfirmDialogProps) {
    const { title, message, confirmText, cancelText = 'Cancel', confirmButtonColor = 'blue' } = options;

    const getConfirmVariant = () => {
        switch (confirmButtonColor) {
            case 'red':
                return 'danger' as const;
            case 'green':
                return 'primary' as const;
            case 'blue':
            default:
                return 'primary' as const;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onCancel} title={title}>
            <div className="space-y-4">
                <p className="text-foreground">{message}</p>

                <div className="flex gap-3 justify-end">
                    <Button variant="secondary" onClick={onCancel}>
                        {cancelText}
                    </Button>
                    <Button variant={getConfirmVariant()} onClick={onConfirm}>
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
 *     confirmButtonColor: 'red'
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
