export namespace Pagination {
  export type Request = {
    page: number;
    quantity: number;
  }

  export type Response<T> = {
    quantityPerPage: number;
    total: number;
    currentPage: number;
    lastPage: number;
    data: Array<T>;
  }
}