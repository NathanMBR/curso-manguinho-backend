import { RepositoryQuestion } from "./RepositoryQuestion";

export interface RepositorySurvey {
  id: string;
  title: string;
  description?: string;
  expiresAt?: Date;
  questions: Array<RepositoryQuestion>;
}