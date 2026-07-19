import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),

  amount: z
    .number()
    .min(3)
    .positive("Amount must be greater than zero"),

  category: z
    .string()
    .min(1, "Category is required"),

  description: z
    .string()
    .min(8, "Description is required"),

  date: z.coerce.date(),
});