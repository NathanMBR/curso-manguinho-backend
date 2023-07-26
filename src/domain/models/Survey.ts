import { Question } from "./Question";

export interface Survey {
  id: string;
  title: string;
  description: string | null;
  expiresAt: Date | null;
  accountId: string;
  questions: Array<Question>;
}