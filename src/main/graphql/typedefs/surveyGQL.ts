export const surveyGQL = `#graphql
  type Answer {
    id: String!
    body: String!
    questionId: String!
  }

  enum QuestionType {
    SINGLE
    MULTIPLE
  }

  type Question {
    id: String!
    title: String!
    description: String
    type: QuestionType!
    surveyId: String!
    answers: [Answer!]!
  }

  type SurveyWithoutQuestions {
    id: String!
    title: String!
    description: String
    expiresAt: String
    accountId: String!
  }

  type Survey {
    id: String!
    title: String!
    description: String
    expiresAt: String
    accountId: String!
    questions: [Question!]!
  }

  input AnswerInput {
    body: String!
  }

  input QuestionInput {
    title: String!
    description: String
    type: QuestionType!
    answers: [AnswerInput!]!
  }

  input SurveyInput {
    title: String!
    description: String
    expiresAt: String
    questions: [QuestionInput!]!
  }

  input QueryInput {
    page: Int
    quantity: Int
  }

  type PaginatedSurveys {
    quantityPerPage: Int!
    total: Int!
    currentPage: Int!
    lastPage: Int!
    data: [SurveyWithoutQuestions!]!
  }

  type AnswerResultReduced {
    id: String!
    body: String!
  }

  type AnswerResult {
    answer: AnswerResultReduced!
    percentage: Float!
  }

  type QuestionResultReduced {
    id: String!
    title: String!
    type: QuestionType!
  }

  type QuestionResult {
    question: QuestionResultReduced!
    answers: [AnswerResult!]!
  }

  type SurveyResultReduced {
    id: String!
    title: String!
  }

  type SurveyResult {
    survey: SurveyResultReduced!
    timesAnswered: Int!
    questions: [QuestionResult!]!
  }

  input SurveyAnswerInput {
    questionId: String!
    answerId: String!
  }

  type Query {
    surveys(query: QueryInput): PaginatedSurveys!
    survey(id: String!): Survey!
    surveyResult(id: String!): SurveyResult!
  }

  type Mutation {
    addSurvey(body: SurveyInput!): Survey!
    addSurveyAnswer(id: String!, body: [SurveyAnswerInput!]!): Boolean
  }
`;
