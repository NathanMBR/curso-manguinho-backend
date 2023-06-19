export namespace Controller {
  export class HttpResponse {
    constructor(
      public readonly statusCode: number,
      public readonly body: any
    ) {}
  }

  export interface Request {
    body?: any;
  }

  export type Response = Promise<HttpResponse>;

  export interface Protocol {
    handle: (httpRequest: Request) => Response;
  }
}