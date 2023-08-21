type ResolverCollection = {
  [method: string]: (parent: any, args: any) => Promise<any>;
};

export type Resolver = {
  Query: ResolverCollection;
  Mutation: ResolverCollection;
};
