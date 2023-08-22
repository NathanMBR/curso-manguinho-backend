export namespace CountManySurveysRepository {
  export type Response = Promise<number>;

  export interface Protocol {
    countMany(): CountManySurveysRepository.Response;
  }
}
