import dotenv from 'dotenv/config'
import mongoose from "mongoose";
import cors from "cors";
import { ExpenseProps } from './schema.js';
import { UserProps } from './users.js';

// dotenv.config();

const mongo_uri = process.env.MONGO_URI

if(!mongo_uri){
  throw new Error("Can't connect to MongoDB");
} 
mongoose.connect(mongo_uri)

export const ExpenseModel = mongoose.model("expenseRecords", ExpenseProps);
export const authModel = mongoose.model("Users", UserProps);
