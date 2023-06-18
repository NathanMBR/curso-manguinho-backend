import { Controller } from "../protocols";

export abstract class HttpResponseHelper {
  public static ok(body: any): Controller.Response {
    return new Controller.Response(200, body);
  }

  public static badRequest(error: Error): Controller.Response {
    return new Controller.Response(400, error);
  }

  public static internalServerError(error: Error): Controller.Response {
    return new Controller.Response(500, error);
  }
}