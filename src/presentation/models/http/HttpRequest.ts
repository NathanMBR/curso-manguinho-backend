export interface HttpRequest {
  body?: any;
  authenticationData?: {
    id: string;
    type: "COMMON" | "ADMIN";
  }
}