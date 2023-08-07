export interface HttpRequest {
  headers?: {
    authorization?: string;
  };
  body?: any;
  query?: any;
  
  authenticationData?: {
    id: string;
    type: "COMMON" | "ADMIN";
  };
}