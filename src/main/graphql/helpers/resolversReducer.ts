import { Resolver } from "../protocols";

export const resolversReducer = (...resolvers: Array<Resolver>): Resolver => {
  const reducedResolver: Resolver = resolvers.reduce(
    (reduced, currentResolver) => {
      return {
        Query: {
          ...reduced.Query,
          ...currentResolver.Query
        },
        Mutation: {
          ...reduced.Mutation,
          ...currentResolver.Mutation
        }
      };
    },

    {
      Query: {},
      Mutation: {}
    }
  );

  return reducedResolver;
};
