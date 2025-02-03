export interface IPagination {
  currentPage: number;
  nextPage: number;
  prevPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  lastPage: number;
  count: number;
  limit: number;
  currentCount: number;
}

export interface IPaginatedResponse<T> {
  result: T[];
  pagination: IPagination;
}
