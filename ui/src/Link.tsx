'use client';

import React, { AnchorHTMLAttributes, forwardRef } from 'react';
import NextLink from 'next/link';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    variant?: 'default' | 'primary' | 'muted';
    underline?: boolean;
    external?: boolean;
}

const variantClasses: Record<string, string> = {
    default: 'text-foreground hover:text-primary',
    primary: 'text-primary hover:text-primary/80',
    muted: 'text-muted-foreground hover:text-foreground',
};

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
    (
        {
            href,
            variant = 'default',
            underline = false,
            external = false,
            className = '',
            children,
            ...props
        },
        ref
    ) => {
        const classes = [
            'transition-colors',
            variantClasses[variant],
            underline ? 'underline underline-offset-4' : 'hover:underline hover:underline-offset-4',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        // External links
        if (external || href.startsWith('http')) {
            return (
                <a
                    ref={ref}
                    href={href}
                    className={classes}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                >
                    {children}
                </a>
            );
        }

        // Internal Next.js links
        return (
            <NextLink ref={ref} href={href} className={classes} {...props}>
                {children}
            </NextLink>
        );
    }
);

Link.displayName = 'Link';

export default Link;
