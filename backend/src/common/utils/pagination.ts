import { paginate, PaginateQuery } from 'nestjs-paginate';
import { ObjectLiteral, Repository } from 'typeorm';

export interface PaginatedResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function paginateData<T extends ObjectLiteral>(
  query: PaginateQuery,
  repo: Repository<T>,
  options: {
    sortableColumns: string[];
    searchableColumns: string[];
    defaultSortBy?: [string, 'ASC' | 'DESC'][];
    filterableColumns?: Record<string, boolean>;
  },
): Promise<PaginatedResult<T>> {
  const result = await paginate(query, repo, options as any);

  return {
    list: result.data as T[],
    total: result.meta.totalItems ?? 0,
    page: result.meta.currentPage ?? 1,
    pageSize: result.meta.itemsPerPage ?? 10,
    totalPages: result.meta.totalPages ?? 0,
  };
}
