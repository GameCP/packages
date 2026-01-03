import React from 'react';

type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
type TypographyVariant = 'default' | 'muted' | 'bold';
type TypographySize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';

interface TypographyProps {
    as?: TypographyElement;
    variant?: TypographyVariant;
    size?: TypographySize;
    children: React.ReactNode;
    className?: string;
}

const variantClasses: Record<TypographyVariant, string> = {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    bold: 'font-semibold',
};

const sizeClasses: Record<TypographySize, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
};

export function Typography({
    as: Element = 'p',
    variant = 'default',
    size = 'base',
    children,
    className = ''
}: TypographyProps) {
    const classes = `${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
    return <Element className={classes}>{children}</Element>;
}
