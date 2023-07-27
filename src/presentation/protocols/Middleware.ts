import {
  HttpRequest,
  HttpResponse
} from "../models";

export namespace Middleware {
  export type Request = HttpRequest;

  export type Response = {
    success: true;
    httpRequest: HttpRequest;
  } | {
    success: false;
    httpResponse: HttpResponse;
  }

  export interface Protocol {
    handle: (httpRequest: Middleware.Request) => Promise<Middleware.Response>;
  }
}