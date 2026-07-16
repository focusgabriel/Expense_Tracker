import mongoose from "mongoose";
import { ExpenseModel } from "../model/index.js";
import { ReturnDocument } from "mongodb";

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


export async function editTransaction(_id:string | string[], userId:string, type:"income" | "expense", amount:number, category:string, description:string, date:Date){

  const transaction = await ExpenseModel.findOne({
  _id,
  userId,
});

console.log("Found:", transaction);
    const updateTransaction = await ExpenseModel.findOneAndUpdate(
      {
        _id,
        userId        
      },
      {
        $set: {type, amount, category, description, date}
      },
      ReturnDocument
    )

  return updateTransaction;
}

export async function deleteTransaction(_id:any, userId:any) {
  const deleteTransact = await ExpenseModel.findOneAndDelete({
    _id,
    userId
  });

  return deleteTransact;
}
