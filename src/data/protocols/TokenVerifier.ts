export namespace TokenVerifier {
  export type Request = {
    token: string;
  };

  export type Response = {
    isValid: true;
    tokenData: Record<string, any>;
  } | {
    isValid: false;
    error: Error
  };

  export interface Protocol {
    verify(request: TokenVerifier.Request): TokenVerifier.Response;
  }
}