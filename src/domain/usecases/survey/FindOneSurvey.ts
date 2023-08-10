import { Survey } from "../../models";

export namespace FindOneSurvey {
  export type Request = {
    id: Survey["id"];
  }

  export type Response = Promise<Survey | null>;

  export interface Protocol {
    findOne(survey: FindOneSurvey.Request): FindOneSurvey.Response;
  }
}
