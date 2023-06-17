import {
  HttpRequest,
  HttpResponse
} from "../protocols";
import { MissingParamError } from "../errors";
import { HttpResponseHelper } from "../helpers";

export class SignUpController {
  constructor() {}

  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name)
      return HttpResponseHelper.badRequest(new MissingParamError("name"));

    if (!httpRequest.body.email)
      return HttpResponseHelper.badRequest(new MissingParamError("email"));

    if (!httpRequest.body.password)
      return HttpResponseHelper.badRequest(new MissingParamError("password"));

    return HttpResponseHelper.ok("ok");
  }
}