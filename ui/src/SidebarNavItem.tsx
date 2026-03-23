
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IconType } from 'react-icons';

export interface SidebarNavItemProps {
    href: string;
    icon?: IconType;
    children: React.ReactNode;
    active?: boolean;
    className?: string;
    title?: string;
    exact?: boolean;
    onClick?: () => void;
    isButton?: boolean;
    disabled?: boolean;
}

export function SidebarNavItem({
    href,
    icon: Icon,
    children,
    active,
    className = '',
    title,
    exact = false,
    onClick,
    isButton = false,
    disabled = false,
}: SidebarNavItemProps) {
    const pathname = usePathname();

    // Use explicit active prop if provided, otherwise calculate from pathname
    const isActive = active !== undefined
        ? active
        : exact
            ? pathname === href
            : pathname === href || pathname?.startsWith(`${href}/`);

    // Data attributes drive all styling — see navigation.css
    const dataProps = {
        'data-active': String(isActive),
        'data-disabled': String(disabled),
    };

    // When disabled, render as a non-interactive span
    if (disabled) {
        return (
            <span
                data-tooltip-id="global-tooltip"
                data-tooltip-content={title || 'Not available'}
                aria-disabled="true"
                className={`nav-item ${className}`}
                {...dataProps}
            >
                {Icon && <Icon className="nav-item-icon" aria-hidden="true" />}
                <span className="nav-item-label">{children}</span>
            </span>
        );
    }

    if (isButton) {
        return (
            <button
                type="button"
                onClick={onClick}
                data-tooltip-id={title ? 'global-tooltip' : undefined}
                data-tooltip-content={title}
                aria-current={isActive ? 'page' : undefined}
                className={`nav-item w-full text-left ${className}`}
                {...dataProps}
            >
                {Icon && <Icon className="nav-item-icon" aria-hidden="true" />}
                <span className="nav-item-label">{children}</span>
            </button>
        );
    }

    return (
        <Link
            href={href}
            onClick={onClick}
            data-tooltip-id={title ? 'global-tooltip' : undefined}
            data-tooltip-content={title}
            className={`nav-item ${className}`}
            {...dataProps}
        >
            {Icon && <Icon className="nav-item-icon" aria-hidden="true" />}
            <span className="nav-item-label">{children}</span>
        </Link>
    );
}
