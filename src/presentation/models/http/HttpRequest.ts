export interface HttpRequest {
  headers?: {
    authorization?: string;
  };
  body?: any;
  authenticationData?: {
    id: string;
    type: "COMMON" | "ADMIN";
  };
}