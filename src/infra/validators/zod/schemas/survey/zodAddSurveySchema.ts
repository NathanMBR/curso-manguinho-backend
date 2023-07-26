import { z as zod } from "zod";

export const zodAddSurveySchema = zod.object(
  {
    title: zod
      .string(
        {
          description: "The survey title",
          required_error: "The survey title is required",
          invalid_type_error: "The survey title must be a string"
        }
      )
      .min(3, "The survey title must have at least 3 characters")
      .max(255, "The survey title must have at most 255 characters"),

    description: zod
      .string(
        {
          description: "The survey description",
          invalid_type_error: "The survey description must be a string if defined"
        }
      )
      .nullable()
      .optional()
      .transform(description => description || null),

    expiresAt: zod
        .string(
          {
            description: "The survey expiration date",
            invalid_type_error: "The survey expiration date must be a string if defined"
          }
        )
        .datetime(
          {
            message: "The survey expiration date must be a valid ISO string"
          }
        )
        .optional()
        .nullable()
        .transform(dateTime => !!dateTime ? new Date(dateTime) : null),

    questions: zod.array(
      zod.object(
        {
          title: zod
            .string(
              {
                description: "The survey question title",
                required_error: "The survey question title is required",
                invalid_type_error: "The survey question title must be a string"
              }
            )
            .min(3, "The survey question title must have at least 3 characters")
            .max(255, "The survey question title must have at most 255 characters"),

          description: zod
            .string(
              {
                description: "The survey question description",
                invalid_type_error: "The survey question description must be a string if defined"
              }
            )
            .optional()
            .nullable()
            .transform(description => description || null),

          type: zod
            .enum(
              [
                "SINGLE",
                "MULTIPLE"
              ],

              {
                description: "The survey question type",
                required_error: "The survey question type is required",
                invalid_type_error: 'The survey question type must be "SINGLE" or "MULTIPLE"'
              }
            ),

          answers: zod
            .array(
              zod.object(
                {
                  body: zod
                    .string(
                      {
                        description: "The question answer body",
                        required_error: "The question answer body is required",
                        invalid_type_error: "The question answer body must be a string"
                      }
                    )
                    .nonempty("The question answer body must not be empty")
                },

                {
                  description: "The question answer object",
                  invalid_type_error: "The question answer must be an object"
                }
              ),

              {
                description: "The question answers list",
                required_error: "The question answers list is required",
                invalid_type_error: "The question answers list must be an array"
              }
            )
            .min(2, "The question answers list must have at least 2 answers")
        },

        {
          description: "The survey question object",
          invalid_type_error: "The survey question must be an object"
        }
      ),

      {
        description: "The survey questions list",
        required_error: "The survey questions list is required",
        invalid_type_error: "The survey questions list must be an array"
      }
    )
    .min(1, "The survey questions list must have at least 1 question")
  },

  {
    description: "The survey payload",
    required_error: "The survey payload is required",
    invalid_type_error: "The survey payload must be an object"
  }
);