export interface IPaginatedListResponseOptions<T> {
  records: T[];
  meta: {
    direction: 'asc' | 'desc';
    page: number;
    perPage: number;
    sortBy: string;
    total: number;
  };
}
