import { FindManySurveys } from "../../../domain/usecases";
import {
  FindManySurveysRepository,
  CountManySurveysRepository
} from "../../protocols";
import {
  calculateRepositoryPaginationParameters,
  getRepositoryPaginationResponse
} from "../../helpers";

export class DbFindManySurveys implements FindManySurveys.Protocol {
  constructor(
    private readonly findManySurveysRepository: FindManySurveysRepository.Protocol,
    private readonly countManySurveysRepository: CountManySurveysRepository.Protocol
  ) {}

  async findMany(request: FindManySurveys.Request): FindManySurveys.Response {
    const repositoryPaginationParameters = calculateRepositoryPaginationParameters(request);

    const [
      surveys,
      count
    ] = await Promise.all(
      [
        this.findManySurveysRepository.findMany(repositoryPaginationParameters),
        this.countManySurveysRepository.countMany()
      ]
    );

    const repositoryPaginationResponse = getRepositoryPaginationResponse(
      {
        ...repositoryPaginationParameters,
        count,
        data: surveys
      }
    );

    return repositoryPaginationResponse;
  }
}
