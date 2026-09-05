import { useEffect, useMemo, useState } from "react";

interface UsePaginatedListOptions<T> {
  initialPageSize?: number;
  searchKeys?: (keyof T)[];
  /** Custom predicate — overrides searchKeys matching when provided */
  filterFn?: (item: T, query: string) => boolean;
}

interface UsePaginatedListResult<T> {
  search: string;
  setSearch: (v: string) => void;
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  setPageSize: (s: number) => void;
  totalItems: number;
  totalPages: number;
  pageItems: T[];
  rangeStart: number;
  rangeEnd: number;
  isSearching: boolean;
}

/**
 * Client-side pagination + search for small reference lists
 * (divisions, districts, upazilas, unions, villages).
 *
 * - Filters by `search` across `searchKeys` (default: ["name"])
 * - Resets to page 1 on search / page-size change
 * - Clamps page when the filtered set shrinks (e.g. after delete)
 */
export function usePaginatedList<T>(
  items: T[],
  { initialPageSize = 8, searchKeys = ["name" as keyof T], filterFn }: UsePaginatedListOptions<T> = {},
): UsePaginatedListResult<T> {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const query = search.trim().toLowerCase();
  const isSearching = query.length > 0;

  const filtered = useMemo(() => {
    if (!isSearching) return items;
    return items.filter((item) => {
      if (filterFn) return filterFn(item, query);
      return searchKeys.some((key) => {
        const value = item?.[key];
        return typeof value === "string" && value.toLowerCase().includes(query);
      });
    });
  }, [items, isSearching, query, searchKeys, filterFn]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Clamp page when data shrinks (delete / filter / page-size change)
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const setPageSize = (size: number) => {
    setPageSizeState(size);
    setPage(1);
  };

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  const pageItems = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize],
  );

  return {
    search,
    setSearch: handleSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    pageItems,
    rangeStart,
    rangeEnd,
    isSearching,
  };
}

/** Sliding window of page numbers, e.g. [4,5,6,7,8]. Max 5 wide. */
export function getPageWindow(currentPage: number, totalPages: number, width = 5): number[] {
  if (totalPages <= 0) return [];
  const count = Math.min(width, totalPages);
  const start = Math.max(1, Math.min(currentPage - Math.floor(width / 2), totalPages - width + 1));
  return Array.from({ length: count }, (_, i) => start + i).filter((p) => p >= 1 && p <= totalPages);
}
