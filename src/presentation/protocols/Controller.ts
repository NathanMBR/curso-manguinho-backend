import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";

export namespace Controller {
  export type Request = HttpRequest;

  export interface Protocol {
    handle: (httpRequest: Request) => HttpResponse;
  }
}