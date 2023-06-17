export namespace Controller {
  export interface Request {
    body?: any;
  }

  export class Response {
    constructor(
      public readonly statusCode: number,
      public readonly body: any
    ) {}
  }

  export interface Protocol {
    handle: (httpRequest: Request) => Response;
  }
}