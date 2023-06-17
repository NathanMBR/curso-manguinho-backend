import { HttpResponse } from "../protocols";

export abstract class HttpResponseHelper {
  public static ok(body: any): HttpResponse {
    return new HttpResponse(200, body);
  }

  public static badRequest(error: Error): HttpResponse {
    return new HttpResponse(400, error);
  }
}