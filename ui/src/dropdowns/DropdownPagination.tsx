'use client';

import { RiArrowLeftSLine, RiArrowRightSLine, RiLoader4Line } from 'react-icons/ri';
import type { DropdownPaginationInfo } from './types';

interface DropdownPaginationProps {
    pagination: DropdownPaginationInfo;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
    className?: string;
}

/**
 * Pagination controls for dropdown footers
 */
export default function DropdownPagination({
    pagination,
    onPageChange,
    isLoading = false,
    className = '',
}: DropdownPaginationProps) {
    const { page, pages, hasNext, hasPrev, total } = pagination;

    // Don't render if only one page
    if (pages <= 1) return null;

    return (
        <div className={`flex items-center justify-between p-2 text-xs text-muted-foreground ${className}`}>
            <div className="flex items-center gap-1">
                {isLoading ? (
                    <RiLoader4Line className="w-3 h-3 animate-spin" />
                ) : null}
                <span>
                    Page {page} of {pages}
                </span>
                {total > 0 && (
                    <span className="text-secondary-foreground">
                        ({total} total)
                    </span>
                )}
            </div>

            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={!hasPrev || isLoading}
                    className="p-1 hover:bg-muted/50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Previous page"
                >
                    <RiArrowLeftSLine className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={!hasNext || isLoading}
                    className="p-1 hover:bg-muted/50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Next page"
                >
                    <RiArrowRightSLine className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
