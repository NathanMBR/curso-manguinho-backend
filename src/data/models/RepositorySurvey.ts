import { RepositoryQuestion } from "./RepositoryQuestion";

export interface RepositorySurvey {
  id: string;
  title: string;
  description: string | null;
  expiresAt: Date | null;
  accountId: string;
  questions: Array<RepositoryQuestion>;
}