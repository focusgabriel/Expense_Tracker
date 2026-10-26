import mongoose from "mongoose";
import { ExpenseModel } from "../model/index.js";
import { ReturnDocument } from "mongodb";
import { createTransaction, modifyTransaction, removeTransaction } from "../repository/transaction.repository.js";
import { AppError } from "../utils/AppError.js";
import { Transaction } from "../constants/index.js";
import { removeAllListeners } from "process";
import { unknown } from "zod";

export async function addTransaction(userId:string, type:"income" | "expense", amount:number, category:string, description:string, date:Date, created_date:Date){
  if(amount < 100 || category === "" || description === "" || !date){
        throw new Error("Spaces must be filled correctly.")
      } 
  await createTransaction({
    userId,
    type,
    amount, 
    category,
    description, 
    date, 
    created_date
  })
  }


export async function editTransaction(_id:string | string[], userId:string, type:"income" | "expense", amount:number, category:string, description:string, date:Date, created_date: Date): Promise<Transaction> {

 if(amount < 100 || category === "" || description === "" || !date){
    throw new AppError("Spaces must be filled correctly.", 401)
  }

  const updateTransaction: unknown = await modifyTransaction({
    _id,
    userId,
    type,
    amount, 
    category,
    description,
    date,
    created_date
  })


  if(!updateTransaction) {
    throw new AppError("Transaction not found", 404)
  }
  return {
    _id,
    userId,
    type,
    amount, 
    category,
    description,
    date,
    created_date
  };
}


export async function deleteTransaction(_id:any, userId:any) {
  const delTransaction:unknown = await removeTransaction(_id, userId);

  if(!delTransaction) {
    throw new AppError("couldn't find transaction", 404);
  }

  return delTransaction

}
