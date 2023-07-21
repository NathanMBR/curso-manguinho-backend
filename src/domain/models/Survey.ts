import { Question } from "./Question";

export interface Survey {
  id: string;
  title: string;
  description?: string;
  expiresAt?: Date;
  questions: Array<Question>;
}