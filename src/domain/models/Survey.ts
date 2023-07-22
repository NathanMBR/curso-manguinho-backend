import { Question } from "./Question";

export interface Survey {
  id: string;
  title: string;
  description: string | null;
  expiresAt: Date | null;
  questions: Array<Question>;
}