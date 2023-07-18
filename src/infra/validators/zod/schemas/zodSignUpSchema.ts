import { z as zod } from "zod";

export const zodSignUpSchema = zod.object(
  {
    name: zod
      .string(
        {
          description: "The account name",
          required_error: "The account name is required",
          invalid_type_error: "The account name must be a string"
        }
      )
      .min(3, "The account name must have at least 3 characters"),

    email: zod
      .string(
        {
          description: "The account email",
          required_error: "The account email is required",
          invalid_type_error: "The account email must be a string"
        }
      )
      .max(255, "The account email must have at most 255 characters")
      .email("The account email must be in a valid format"),

    password: zod
      .string(
        {
          description: "The account password",
          required_error: "The account password is required",
          invalid_type_error: "The account password must be a string"
        }
      )
      .min(8, "The account password must have at least 8 characters")
  },

  {
    description: "The account payload",
    required_error: "The account payload is required",
    invalid_type_error: "The account payload must be an object"
  }
);