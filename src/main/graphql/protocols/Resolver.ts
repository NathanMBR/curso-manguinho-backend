import { ApolloContext } from "./Context";

type ResolverCollection = {
  [method: string]: (parent: any, args: any, ctx: ApolloContext) => Promise<any>;
};

export type Resolver = {
  Query: ResolverCollection;
  Mutation: ResolverCollection;
};
