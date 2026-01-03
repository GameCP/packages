'use client';

interface CountBadgeProps {
  count: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export default function CountBadge({
  count,
  className = '',
  size = 'sm',
  variant = 'primary',
}: CountBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 min-w-[18px]',
    md: 'text-sm px-2 py-1 min-w-[20px]',
    lg: 'text-base px-2.5 py-1.5 min-w-[24px]',
  };

  const variantClasses = {
    primary: 'bg-ring ',
    secondary: 'bg-muted0 ',
    success: 'bg-green-500 ',
    warning: 'bg-yellow-500 ',
    error: 'bg-red-500 ',
  };

  if (count <= 0) return null;

  return (
    <span
      aria-label={`Count: ${count}`}
      className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-full text-center font-medium ${className}`}
    >
      {count}
    </span>
  );
}
