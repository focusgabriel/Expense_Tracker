import mongoose from "mongoose";
import { number } from "zod";

type budgetSchema = {
  userId: string,
  budgetCategory: string,
  budgetAmount: number
}

export const budget = new mongoose.Schema<budgetSchema>({
  userId: {
    type: String,
    ref: "Users",
    required: true
  },

  budgetCategory: {
    type: String,
    required: true
  },

  budgetAmount: {
    type: Number,
    required: true
  }
});