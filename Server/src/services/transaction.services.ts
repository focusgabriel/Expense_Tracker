import mongoose from "mongoose";
import { allTrans, createTransaction, document, filterTrans, modifyTransaction, MonthExpense, MonthIncome, prevMonthlyExpenseandIncome, prevMonthTransactions, removeTransaction, transactions, transactionsById } from "../repository/transaction.repository.js";
import { AppError } from "../utils/AppError.js";
import { filterTransDto, Transaction } from "../constants/index.js";
export async function addTransaction({userId, type, amount, category, description, date, created_date}: Transaction){
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


export async function editTransaction(_id:string | string[], userId:string, type:"income" | "expense", amount:number, category:string, description:string, date:Date, created_date: Date) {

 if(amount < 100 || category === "" || description === "" || !date){
    throw new AppError("Spaces must be filled correctly.", 401)
  }

  const updateTransaction = await modifyTransaction({
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
  return updateTransaction
}


export async function deleteTransaction(_id:any, userId:any) {
  const delTransaction = await removeTransaction(_id, userId);

  if(!delTransaction) {
    throw new AppError("couldn't find transaction", 404);
  }

  return delTransaction

}


export async function getAllTrans(userId:string, type:"income" | "expense") {
  let allTransactions = await allTrans(userId, type);

  if(!allTransactions){
    throw new AppError("Transactions not Found.", 404)
  }

  return allTransactions;
}


export async function getMonthIncome(userId:string, type:"income"|"expense", firstDayOfMonth:Date, firstDayOfNextMonth:Date){
  if(!userId || !type || !firstDayOfMonth || firstDayOfNextMonth){
    throw new AppError("Month Income not Found.", 404)
  }
  return await MonthIncome(userId, type,firstDayOfMonth,firstDayOfNextMonth);

}
  
export async function getMonthExpense(userId:string, type:"income"|"expense", firstDayOfMonth:Date, firstDayOfNextMonth:Date){
  if(!userId || !type || !firstDayOfMonth || firstDayOfNextMonth){
    throw new AppError("No Month Income Found.", 404)
  }
  return await MonthExpense(userId, type,firstDayOfMonth,firstDayOfNextMonth)
}


export async function getPrevMonthTransactions(userId:string, firstDayOfPreviousMonth:Date, firstDayOfCurrentMonth:Date){
  if(!userId || !firstDayOfPreviousMonth || !firstDayOfCurrentMonth) {
    throw new AppError("No Previous Transactions Found.", 404)
  }

  return await prevMonthTransactions(userId, firstDayOfPreviousMonth, firstDayOfCurrentMonth);
}


export async function getTotalTransactions(userId:string) {
  if(userId){
    throw new AppError("Can't find Transaction for this User", 404)
  }

  return await transactions(userId);
}


export async function getRecentTransactions(userId:string) {
  if(userId){
    throw new AppError("Can't find Transaction for this User", 404)
  }

  return await transactions(userId);
}

export async function getTransactionsById(_id:any, userId:string){

  let trans = await transactionsById(_id, userId);

  if(!trans){
    throw new AppError("UserId and Id are required", 401)
  }

  return trans;
}


export async function getPrevMonthlyExpenseandIncome(userId:string, type:"income" | "expense", startOfMonth:Date, startOfAnotherMonth:Date){
  
  let prev = await prevMonthlyExpenseandIncome(userId, type, startOfMonth, startOfAnotherMonth);

  if(!prev){
    throw new AppError("Previous Month Expense and Income not Found.", 404);
  }

  return prev
}


export async function filterTransactions({filter, sortOption, skip, limitNumber}: filterTransDto){
  let filterTransact = await filterTrans({
    filter,
    sortOption,
    skip,
    limitNumber
  })

  if(!filterTransact) {
    throw new AppError("can't filter transaction", 400);
  }

  return filterTransact;
}


export async function documents(filter:any) {

  if(!filter) {
    throw new AppError("Filter's not Found", 404)
  }
  return await document(filter);
}

