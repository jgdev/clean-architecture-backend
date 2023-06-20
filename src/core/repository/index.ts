export type SearchParams<T> = Partial<T> | string;
export type OrderParams<T> = {
  sortBy: keyof T;
  orderBy: "asc" | "desc";
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
