/**
 * Single source of truth for pagination across the application.
 */

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;

export type PageParams = {
  page: number;
  pageSize?: number;
};

export type PaginatedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

export function normalizePageParams(params: PageParams): {
  page: number;
  pageSize: number;
  from: number;
  to: number;
} {
  const page = Math.max(1, Math.floor(params.page) || 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(
      1,
      Math.floor(params.pageSize ?? DEFAULT_PAGE_SIZE) || DEFAULT_PAGE_SIZE
    )
  );
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return { page, pageSize, from, to };
}

export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number
): PaginatedResult<T> {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return {
    items,
    page,
    pageSize,
    total,
    totalPages,
    hasMore: page < totalPages,
  };
}
