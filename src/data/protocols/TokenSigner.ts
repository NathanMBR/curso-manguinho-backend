export namespace TokenSigner {
  export type Request = {
    id: string;
    data?: Record<string, unknown>;
  };

  export type Response = string;

  export interface Protocol {
    sign(request: TokenSigner.Request): TokenSigner.Response;
  }
}