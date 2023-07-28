import { HttpResponse } from "../models";

export abstract class HttpResponseHelper {
  public static ok(body: any): HttpResponse {
    return new HttpResponse(200, body);
  }

  public static created(body: any): HttpResponse {
    return new HttpResponse(201, body);
  }

  public static noContent(): HttpResponse {
    return new HttpResponse(204, null);
  }

  public static badRequest(error: Error): HttpResponse {
    return new HttpResponse(400, error);
  }

  public static unauthorized(error: Error): HttpResponse {
    return new HttpResponse(401, error);
  }

  public static forbidden(error: Error): HttpResponse {
    return new HttpResponse(403, error);
  }

  public static notFound(error: Error): HttpResponse {
    return new HttpResponse(404, error);
  }

  public static internalServerError(error: Error): HttpResponse {
    return new HttpResponse(500, error);
  }
}