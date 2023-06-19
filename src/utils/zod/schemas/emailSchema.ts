import { z as zod } from "zod";

export const emailSchema = zod.string().email();