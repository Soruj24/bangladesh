import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPageWindow } from "@/hooks/use-paginated-list";
import { cn } from "@/lib/utils";

// eslint-disable-next-line react-refresh/only-export-components
export const PAGE_SIZE_OPTIONS = [5, 8, 10, 15, 20];

interface DataPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  rangeStart: number;
  rangeEnd: number;
  onPageChange: (page: number) => void;
  /** e.g. "records", "users", "villages" */
  itemLabel?: string;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

/**
 * Professional paginated-list footer used across the dashboard.
 *
 * Left:  "Showing X–Y of Z records" + rows-per-page selector
 * Right: Previous | 1 2 3 … N | Next  (numbers collapse on mobile)
 */
export function DataPagination({
  page,
  totalPages,
  totalItems,
  rangeStart,
  rangeEnd,
  onPageChange,
  itemLabel = "records",
  pageSize,
  onPageSizeChange,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  className,
}: DataPaginationProps) {
  const goTo = (e: React.MouseEvent, next: number) => {
    e.preventDefault();
    if (next < 1 || next > totalPages || next === page) return;
    onPageChange(next);
  };

  const window = getPageWindow(page, totalPages);
  const showTail = totalPages > 5 && page < totalPages - 2;
  const showHeadEllipsis = totalPages > 6 && page > 4;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Mobile page indicator */}
      {totalPages > 1 && (
        <p className="text-center text-xs tabular text-muted-foreground sm:hidden" aria-live="polite">
          Page {page} of {totalPages}
        </p>
      )}

      <div className="flex flex-col gap-3 border-t px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-start">
          <p className="text-center text-xs tabular text-muted-foreground sm:text-left" aria-live="polite">
            {totalItems === 0
              ? `No ${itemLabel}`
              : `Showing ${rangeStart}–${rangeEnd} of ${totalItems} ${itemLabel}`}
          </p>

          {pageSize && onPageSizeChange && (
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="hidden md:inline">Rows per page</span>
              <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
                <SelectTrigger className="h-8 w-[70px] text-xs tabular" aria-label="Rows per page">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((opt) => (
                    <SelectItem key={opt} value={String(opt)} className="text-xs tabular">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => goTo(e, page - 1)}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>

              {showHeadEllipsis && (
                <PaginationItem className="hidden sm:block">
                  <PaginationLink href="#" onClick={(e) => goTo(e, 1)} className="tabular">
                    1
                  </PaginationLink>
                </PaginationItem>
              )}
              {showHeadEllipsis && (
                <PaginationItem className="hidden sm:block" aria-hidden="true">
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {window.map((p) => (
                <PaginationItem key={p} className="hidden sm:block">
                  <PaginationLink
                    href="#"
                    isActive={page === p}
                    onClick={(e) => goTo(e, p)}
                    className="tabular"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {showTail && (
                <>
                  <PaginationItem className="hidden sm:block" aria-hidden="true">
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem className="hidden sm:block">
                    <PaginationLink href="#" onClick={(e) => goTo(e, totalPages)} className="tabular">
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => goTo(e, page + 1)}
                  aria-disabled={page === totalPages}
                  className={page === totalPages ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
