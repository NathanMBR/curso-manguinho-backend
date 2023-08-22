import { FastifyInstance } from "fastify";
import { ApolloServer, BaseContext } from "@apollo/server";
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify";

import {
  accountGQL,
  accountGQLResolvers
} from "../../../graphql";
import { APOLLO_SERVER_STACKTRACE } from "../../../config";
import {
  typeDefsReducer,
  resolversReducer
} from "../../../graphql";

export const injectApolloServerRoutes = async (app: FastifyInstance) => {
  const apolloServer = new ApolloServer<BaseContext>(
    {
      includeStacktraceInErrorResponses: APOLLO_SERVER_STACKTRACE,
      typeDefs: typeDefsReducer(
        accountGQL
      ),
      resolvers: resolversReducer(
        accountGQLResolvers
      ),
      plugins: [
        fastifyApolloDrainPlugin(app)
      ]
    }
  );

  await apolloServer.start();

  const fastifyApolloPlugin = fastifyApollo(apolloServer);
  await app.register(fastifyApolloPlugin, { prefix: "/graphql" });
};
