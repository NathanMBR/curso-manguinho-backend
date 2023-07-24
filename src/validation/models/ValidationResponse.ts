export interface ValidationResponse<T> {
  isValid: boolean;
  data: T;
  errors: Array<string>;
}