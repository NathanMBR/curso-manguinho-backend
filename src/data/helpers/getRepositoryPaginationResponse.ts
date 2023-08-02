import { RepositoryPagination } from "../models/RepositoryPagination";
import { Pagination } from "../../domain/models";

type Request<T> = RepositoryPagination & {
  count: number,
  data: Array<T>
};

export const getRepositoryPaginationResponse = <T>(request: Request<T>): Pagination.Response<T> => {
  const {
    take,
    skip,
    count,
    data
  } = request;

  const currentPage = skip / take + 1;
  const lastPage = Math.ceil(count / take);

  return {
    quantityPerPage: take,
    total: count,
    currentPage,
    lastPage,
    data
  };
};