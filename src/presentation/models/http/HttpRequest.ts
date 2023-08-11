export interface HttpRequest {
  headers?: {
    authorization?: string;
  };
  body?: any;
  params?: any;
  query?: any;

  authenticationData?: {
    id: string;
    type: "COMMON" | "ADMIN";
  };
}
