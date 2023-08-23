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
    data: [Survey!]!
  }

  type AnswerResult {
    answer: {
      id: String!
      body: String!
    }
    percentage: Float!
  }

  type QuestionResult {
    question: {
      id: String!
      title: String!
      type: QuestionType!
    }
    answers: [AnswerResult!]!
  }

  type SurveyResult {
    survey: {
      id: String!
      title: String!
    }
    timesAnswered: Int!
    questions: [QuestionResult!]!
  }

  type Query {
    surveys(query: QueryInput): PaginatedSurveys!
    survey(id: String!): Survey!
    surveyResult(id: String!): SurveyResult!
  }

  type Mutation {
    addSurvey(body: SurveyInput!): Survey!
    addSurveyAnswer(body: SurveyAnswerInput): boolean
  }
`;
