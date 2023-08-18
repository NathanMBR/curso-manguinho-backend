import {
  HttpRequest,
  HttpResponse
} from "../models";

export namespace Controller {
  export type Request = HttpRequest;

  export type Response = Promise<HttpResponse>;

  export interface Protocol {
    handle(httpRequest: Controller.Request): Controller.Response;
  }
}
