export namespace VerifyAccountAuthentication {
  export type Request = {
    token: string;
  };

  export type Response = {
    isAuthenticationValid: true;
    authenticationData: Record<string, any>;
  } | {
    isAuthenticationValid: false;
    error: Error;
  };

  export interface Protocol {
    verify(request: VerifyAccountAuthentication.Request): VerifyAccountAuthentication.Response;
  }
}