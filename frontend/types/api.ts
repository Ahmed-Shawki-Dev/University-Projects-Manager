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

// User Claims
export interface CurrentUserClaims {
  userId: string;
  userRole: string;
  fullName: string;
  email: string;
  universitySlug: string;
  facultySlug: string;
  studentId: string;
  studentCode: string;
  exp: number;
  iss: string;
  aud: string;
}
