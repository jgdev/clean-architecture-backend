export type SearchParams<T> = Partial<T>;
export type SortBy = "asc" | "desc";
export type OrderParams<T> = {
  sortBy?: SortBy;
  orderBy?: keyof T;
};

export const DEFAULT_ROWS_LIMIT = 30;

export type PaginatedParams<T> = {
  skip?: number;
  limit?: number;
} & Partial<OrderParams<T>>;

export type PaginatedResult<T> = {
  total: number;
  skip: number;
  limit: number;
  result: T[];
} & OrderParams<T>;
