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

export async function editTransaction(id:string | string[], type:"income" | "expense", amount:number, category:string, description:string, date:Date){
    const updateTransaction = await ExpenseModel.findByIdAndUpdate(
      id,
      {$set: {type, amount, category, description, date}}
    )

  return updateTransaction;
  }