import { UserAnsweredSurvey } from "../../models";

export namespace FindOneUserAnsweredSurvey {
  export type Request = {
    accountId: UserAnsweredSurvey["accountId"];
    surveyId: UserAnsweredSurvey["surveyId"];
  };

  export type Response = Promise<UserAnsweredSurvey | null>;

  export interface Protocol {
    findOne(request: FindOneUserAnsweredSurvey.Request): FindOneUserAnsweredSurvey.Response;
  }
}
