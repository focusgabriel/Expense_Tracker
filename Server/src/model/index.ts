import mongoose from "mongoose";
import dotenv from "dotenv"
import cors from "cors";
import { ExpenseProps } from './transaction.js';
import { UserProps } from './users.js';
import { budget } from "./budget.js";

dotenv.config();

const mongo_uri = process.env.MONGO_URI

if(!mongo_uri){
  throw new Error("Can't connect to MongoDB");
} 
mongoose.connect(mongo_uri)

export const ExpenseModel = mongoose.model("expenseRecords", ExpenseProps);
export const authModel = mongoose.model("Users", UserProps);
export const budgetModel = mongoose.model("Budgets", budget)
