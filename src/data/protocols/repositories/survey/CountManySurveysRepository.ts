import { RepositoryPagination } from "../../../models";

export namespace CountManySurveysRepository {
  export type Request = RepositoryPagination;

  export type Response = Promise<number>;

  export interface Protocol {
    countMany(request: CountManySurveysRepository.Request): CountManySurveysRepository.Response;
  }
}