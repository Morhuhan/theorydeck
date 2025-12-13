export type ApiResponse<T = any> = {
  data?: T;
  error?: string;
  message?: string;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};