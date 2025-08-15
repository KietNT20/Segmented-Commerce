export interface Paginated<T> {
  data: T[];
  meta: {
    totalPages: number;
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
  };
}
