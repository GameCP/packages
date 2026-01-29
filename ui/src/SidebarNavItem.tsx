
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IconType } from 'react-icons';

/**
 * Get the sidebar nav item classes based on active state.
 * Useful for extensions that need custom Link components.
 */
export function getSidebarNavItemClasses(isActive: boolean, className: string = '') {
    return `group flex items-center gap-0 overflow-hidden rounded-md px-3 py-2 text-sm font-medium outline-hidden ring-sidebar-ring transition-[width,height,padding,background-color,color] duration-300 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        } ${className}`;
}

/**
 * Get the sidebar nav icon classes.
 */
export function getSidebarNavIconClasses(isActive: boolean = false) {
    return `mr-3 h-5 w-5 shrink-0 transition-all duration-300 ease-in-out${isActive ? ' text-primary-foreground' : ''}`;
}

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
    /** Custom Link component for extensions that inject their own routing */
    LinkComponent?: React.ComponentType<{ href: string; className?: string; onClick?: () => void; children: React.ReactNode }>;
    /** Custom pathname for extensions that inject their own routing context */
    pathname?: string;
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
    LinkComponent,
    pathname: externalPathname,
}: SidebarNavItemProps) {
    const nextPathname = usePathname();
    const pathname = externalPathname ?? nextPathname;

    // Use explicit active prop if provided, otherwise calculate from pathname
    const isActive = active !== undefined
        ? active
        : exact
            ? pathname === href
            : pathname === href || pathname?.startsWith(`${href}/`);

    const commonClasses = getSidebarNavItemClasses(isActive, className);
    const iconClasses = getSidebarNavIconClasses(isActive);

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
                        className={iconClasses}
                        aria-hidden="true"
                    />
                )}
                <span>{children}</span>
            </button>
        );
    }

    // Use custom Link if provided, otherwise use Next.js Link
    const LinkEl = LinkComponent || Link;

    return (
        <LinkEl
            href={href}
            onClick={onClick}
            className={commonClasses}
        >
            {Icon && (
                <Icon
                    className={iconClasses}
                    aria-hidden="true"
                />
            )}
            <span>{children}</span>
        </LinkEl>
    );
}
