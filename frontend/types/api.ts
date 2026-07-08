export interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;
  message: string;
  errors: string[];
  status: number;
}

export interface PagedResponse<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export type PaginatedApiResponse<T> = ApiResponse<PagedResponse<T>>;
