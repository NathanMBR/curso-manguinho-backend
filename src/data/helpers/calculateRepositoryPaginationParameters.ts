import { Pagination } from "../../domain/models";
import { RepositoryPagination } from "../models/RepositoryPagination";

export const calculateRepositoryPaginationParameters = (request: Pagination.Request): RepositoryPagination => {
  const {
    quantity,
    page
  } = request;

  const take = quantity;
  const skip = (page - 1) * take;

  return {
    take,
    skip
  };
};