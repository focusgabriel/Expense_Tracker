import mongoose from "mongoose";


type ExpenseSchema = {
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: Date;
  created_date: Date;
}

export const ExpenseProps = new mongoose.Schema<ExpenseSchema>({
  type: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  created_date: {
    type: Date,
    required: true,
  },
})