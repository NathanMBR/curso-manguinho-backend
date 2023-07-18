import { Controller } from "../protocols";

export abstract class HttpResponseHelper {
  public static ok(body: any): Controller.HttpResponse {
    return new Controller.HttpResponse(200, body);
  }

  public static badRequest(error: Error): Controller.HttpResponse {
    return new Controller.HttpResponse(400, error);
  }

  public static unauthorized(error: Error): Controller.HttpResponse {
    return new Controller.HttpResponse(401, error);
  }

  public static notFound(error: Error): Controller.HttpResponse {
    return new Controller.HttpResponse(404, error);
  }

  public static internalServerError(error: Error): Controller.HttpResponse {
    return new Controller.HttpResponse(500, error);
  }
}