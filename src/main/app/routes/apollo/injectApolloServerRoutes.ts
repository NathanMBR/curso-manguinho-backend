import { FastifyInstance } from "fastify";
import { ApolloServer } from "@apollo/server";
import fastifyApollo, {
  fastifyApolloDrainPlugin,
  ApolloFastifyContextFunction
} from "@as-integrations/fastify";

import {
  ApolloContext,
  typeDefsReducer,
  accountGQL,
  surveyGQL,
  resolversReducer,
  accountGQLResolvers,
  surveyGQLResolvers
} from "../../../graphql";
import { APOLLO_SERVER_STACKTRACE } from "../../../config";

export const injectApolloServerRoutes = async (app: FastifyInstance) => {
  const apolloServer = new ApolloServer<ApolloContext>(
    {
      includeStacktraceInErrorResponses: APOLLO_SERVER_STACKTRACE,
      typeDefs: typeDefsReducer(
        accountGQL,
        surveyGQL
      ),
      resolvers: resolversReducer(
        accountGQLResolvers,
        surveyGQLResolvers
      ),

      plugins: [
        fastifyApolloDrainPlugin(app)
      ]
    }
  );

  await apolloServer.start();

  const apolloFastifyContextHandler: ApolloFastifyContextFunction<ApolloContext> = async request => {
    return {
      headers: {
        authorization: request.headers.authorization
      }
    }
  };

  const fastifyApolloPlugin = fastifyApollo(apolloServer);
  const fastifyApolloPluginOptions = {
    prefix: "/graphql",
    context: apolloFastifyContextHandler
  };

  await app.register(fastifyApolloPlugin, fastifyApolloPluginOptions);
};
