import { RepositoryQuestion } from "./RepositoryQuestion";

export interface RepositorySurvey {
  id: string;
  title: string;
  description: string | null;
  expiresAt: Date | null;
  questions: Array<RepositoryQuestion>;
}