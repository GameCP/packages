
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
}: SidebarNavItemProps) {
    const pathname = usePathname();

    // Use explicit active prop if provided, otherwise calculate from pathname
    const isActive = active !== undefined
        ? active
        : exact
            ? pathname === href
            : pathname === href || pathname?.startsWith(`${href}/`);

    const commonClasses = `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ease-in-out ${isActive
            ? ''
            : 'hover:bg-muted'
        } ${className}`;

    if (isButton) {
        return (
            <button
                type="button"
                onClick={onClick}
                title={title}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full text-left ${commonClasses}`}
            >
                {Icon && (
                    <Icon
                        className={`mr-3 h-5 w-5 shrink-0 transition-all duration-150 ease-in-out`}
                        aria-hidden="true"
                    />
                )}
                <span>{children}</span>
            </button>
        );
    }

    return (
        <Link
            href={href}
            onClick={onClick}
            title={title}
            aria-current={isActive ? 'page' : undefined}
            className={commonClasses}
        >
            {Icon && (
                <Icon
                    className={`mr-3 h-5 w-5 shrink-0 transition-all duration-150 ease-in-out`}
                    aria-hidden="true"
                />
            )}
            <span>{children}</span>
        </Link>
    );
}
