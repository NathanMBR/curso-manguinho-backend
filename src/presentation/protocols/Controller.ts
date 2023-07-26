export namespace Controller {
  export class HttpResponse {
    constructor(
      public readonly statusCode: number,
      public readonly body: any
    ) {}
  }

  export interface Request {
    body?: any;
    authenticationData?: {
      id: string;
    };
  }

  export type Response = Promise<HttpResponse>;

  export interface Protocol {
    handle: (httpRequest: Request) => Response;
  }
}