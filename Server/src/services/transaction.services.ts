import mongoose from "mongoose";
import { ExpenseModel } from "../model/index.js";

export async function addTransaction(type:"income" | "expense", amount:number, category:string, description:string, date:Date, created_date:Date){
    const newTransaction = new ExpenseModel({
    type,
    amount, 
    category,
    description, 
    date, 
    created_date,
  })
  }

export async function editTransaction(id:string | string[], userId:string, type:"income" | "expense", amount:number, category:string, description:string, date:Date){
    const updateTransaction = await ExpenseModel.findOneAndUpdate(
      {
        id,
        userId,
        $set: {type, amount, category, description, date},
      
      }
    )

  return updateTransaction;
}

export async function deleteTransaction(id:any, userId:any) {
  const deleteTransact = await ExpenseModel.findOneAndDelete(
    id,
    userId
  );

  return deleteTransact;
}