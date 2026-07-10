import { ExpenseModel } from "../db/index.js";

export async function addTransaction(type:"income" | "expense", amount:number, category:string, description:string, date:Date, created_date:Date){
    const newTransaction = new ExpenseModel({
    type,
    amount, 
    category,
    description, 
    date, 
    created_date,
  })

  await newTransaction.save();
  // console.log(newTransaction);
  return newTransaction;
  }