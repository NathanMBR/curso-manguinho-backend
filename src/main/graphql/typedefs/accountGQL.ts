export const accountGQL = `#graphql
  enum AccountType {
    COMMON
    ADMIN
  }

  type AccountWithoutPassword {
    id: String!
    name: String!
    email: String!
    type: AccountType!
  }

  type LogInResponse {
    token: String!
    account: AccountWithoutPassword!
  }

  input LogInRequest {
    email: String!
    password: String!
  }

  type Query {
    logIn(body: LogInRequest!): LogInResponse!
  }

  input SignUpRequest {
    name: String!
    email: String!
    password: String!
  }

  type Mutation {
    signUp(body: SignUpRequest!): AccountWithoutPassword!
  }
`;
