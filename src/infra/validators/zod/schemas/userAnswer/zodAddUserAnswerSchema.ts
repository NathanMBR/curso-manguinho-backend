import { z as zod } from "zod";

export const zodAddUserAnswerSchema = zod.array(
  zod.object(
    {
      questionId: zod
        .string(
          {
            description: "The user answer question ID",
            required_error: "The user answer question ID is required",
            invalid_type_error: "The user answer question ID must be a string"
          }
        )
        .uuid("The user answer question ID must be a valid UUID"),

      answerId: zod
        .string(
          {
            description: "The user answer \"answer ID\"",
            required_error: "The user answer \"answer ID\" is required",
            invalid_type_error: "The user answer \"answer ID\" must be a string"
          }
        )
        .uuid("The user answer \"answer ID\" must be a valid UUID")
    },

    {
      description: "The add user answer payload",
      required_error: "The add user answer payload is required",
      invalid_type_error: "The add user answer payload must be an object"
    }
  ),

  {
    description: "The add user answers list",
    required_error: "The add user answers list is required",
    invalid_type_error: "The add user answers list must be an array"
  }
);
