import {
  makeFindManySurveysController,
  makeFindOneSurveyController,
  makeGetSurveyResultController,
  makeAddSurveyController,
  makeAddSurveyAnswerController,

  makeAuthenticationMiddleware,
  makeAdminMiddleware
} from "../../factories";

import { apolloServerResolverAdapter } from "../../adapters";
import { Resolver } from "../protocols";


export const surveyGQLResolvers: Resolver = {
  Query: {
    surveys: async (_parent, args, ctx) => {
      const findManySurveysController = makeFindManySurveysController();
      const authenticationMiddleware = makeAuthenticationMiddleware();

      const httpResponseBody = await apolloServerResolverAdapter(
        {
          query: args.query,
          headers: ctx.headers
        },
        findManySurveysController,
        authenticationMiddleware
      );

      return httpResponseBody;
    },

    survey: async (_parent, args, ctx) => {
      const findOneSurveyController = makeFindOneSurveyController();
      const authenticationMiddleware = makeAuthenticationMiddleware();

      const httpResponseBody = await apolloServerResolverAdapter(
        {
          params: {
            id: args.id
          },
          headers: ctx.headers
        },
        findOneSurveyController,
        authenticationMiddleware
      );

      return httpResponseBody;
    },

    surveyResult: async (_parent, args, ctx) => {
      const getSurveyResultController = makeGetSurveyResultController();
      const authenticationMiddleware = makeAuthenticationMiddleware();
      const adminMiddleware = makeAdminMiddleware();

      const httpResponseBody = await apolloServerResolverAdapter(
        {
          params: {
            id: args.id
          },
          headers: ctx.headers
        },
        getSurveyResultController,
        authenticationMiddleware,
        adminMiddleware
      );

      return httpResponseBody;
    }
  },

  Mutation: {
    addSurvey: async (_parent, args, ctx) => {
      const addSurveyController = makeAddSurveyController();
      const authenticationMiddleware = makeAuthenticationMiddleware();
      const adminMiddleware = makeAdminMiddleware();

      const httpResponseBody = await apolloServerResolverAdapter(
        {
          body: args.body,
          headers: ctx.headers
        },
        addSurveyController,
        authenticationMiddleware,
        adminMiddleware
      );

      return httpResponseBody;
    },

    addSurveyAnswer: async (_parent, args, ctx) => {
      const addSurveyAnswerController = makeAddSurveyAnswerController();
      const authenticationMiddleware = makeAuthenticationMiddleware();

      const httpResponseBody = await apolloServerResolverAdapter(
        {
          params: {
            id: args.id
          },
          body: args.body,
          headers: ctx.headers
        },
        addSurveyAnswerController,
        authenticationMiddleware
      );

      return httpResponseBody;
    }
  }
};
