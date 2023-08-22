import {
  makeLogInController,
  makeSignUpController
} from "../../factories";
import { apolloServerResolverAdapter } from "../../adapters";
import { Resolver } from "../protocols";

export const accountGQLResolvers: Resolver = {
  Query: {
    logIn: async (_parent, args) => {
      const logInController = makeLogInController();

      const httpResponseBody = await apolloServerResolverAdapter(
        {
          body: args.body
        },
        logInController
      );

      return httpResponseBody;
    }
  },

  Mutation: {
    signUp: async (_parent, args) => {
      const signUpController = makeSignUpController();

      const httpResponseBody = await apolloServerResolverAdapter(
        {
          body: args.body
        },
        signUpController
      );

      return httpResponseBody;
    }
  }
};
