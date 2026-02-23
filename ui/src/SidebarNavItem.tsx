
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

    const commonClasses = `group flex items-center gap-0 overflow-hidden rounded-md px-3 py-2 text-sm font-medium outline-hidden ring-sidebar-ring transition-all duration-300 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${isActive
        ? 'bg-primary/15 backdrop-blur-md border border-primary/30 text-primary shadow-[0_0_12px_-3px_hsl(var(--primary)/0.2)] hover:bg-primary/20 hover:border-primary/50 hover:shadow-[0_0_16px_-2px_hsl(var(--primary)/0.3)]'
        : 'border border-transparent text-sidebar-foreground hover:bg-sidebar-accent/50 hover:backdrop-blur-sm hover:border-sidebar-foreground/10 hover:text-sidebar-accent-foreground active:bg-sidebar-accent'
        } ${className}`;

    const iconClasses = `mr-3 h-5 w-5 shrink-0 transition-all duration-300 ease-in-out${isActive ? ' text-primary' : ''}`;

    if (isButton) {
        return (
            <button
                type="button"
                onClick={onClick}
                data-tooltip-id={title ? 'global-tooltip' : undefined}
                data-tooltip-content={title}
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

    return (
        <Link
            href={href}
            onClick={onClick}
            data-tooltip-id={title ? 'global-tooltip' : undefined}
            data-tooltip-content={title}
            className={commonClasses}
        >
            {Icon && (
                <Icon
                    className={iconClasses}
                    aria-hidden="true"
                />
            )}
            <span>{children}</span>
        </Link>
    );
}
