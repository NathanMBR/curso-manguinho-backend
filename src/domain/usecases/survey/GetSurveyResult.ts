import { SurveyResult } from "../../models";

export namespace GetSurveyResult {
  export type Request = {
    surveyId: SurveyResult["survey"]["id"];
  }

  export type Response = Promise<SurveyResult | null>;

  export interface Protocol {
    get(request: GetSurveyResult.Request): GetSurveyResult.Response;
  }
}
