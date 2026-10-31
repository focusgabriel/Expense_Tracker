import { z } from "zod";

export const budgetSchema = z.object({
  budgetCategory: z
    .string()
    .min(4, "Category is required"),

  budgetAmount: z
    .number()
    .min(3)
    .positive("Amount must be greater than 0")

})