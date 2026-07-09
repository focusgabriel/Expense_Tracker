import express, { Request, Response, Application } from 'express';
import { addTransaction } from "../services/transaction.services.js";
import { ExpenseModel } from '../db/index.js';

export async function addTransactionController(req:Request, res:Response){
  try {
    const {type, amount, category, description, date, created_date=new Date()} = req.body
    await addTransaction(type, amount, category, description, date, created_date);
    res.status(201).json({type, amount, category, description, date, created_date});
  } catch (error) {
    console.log("Error Message:", error)
    res.status(500).json({message: "Error Occurred while adding Transaction"})
  }
};

export async function totalTransactionController(_req:Request, res:Response){
  try {
    const income = await ExpenseModel.find({type:"income"})
    const Total_income = income.reduce((value, sum) => value + sum.amount, 0);
    
    const expense = await ExpenseModel.find({type:"expense"})
    const Total_expense = expense.reduce((value, sum) => value + sum.amount, 0);
    
    const NetBalance = Total_income - Total_expense;
    res.status(200).json({Total_income, Total_expense, NetBalance});
  } catch (error) {
    console.log("Error:", error)
  }
  
};

export async function getTransaction(req:Request, res:Response){
  try{
    const allTransactions = await ExpenseModel.find().sort({created_date: -1})
    res.status(200).json(allTransactions)
    console.log(allTransactions)

  } catch(err){
    res.status(500).json({message:"error loading data"})
    console.log("error:",err);
  }
};

export async function getMonthlyIncome(req:Request, res:Response) {
// getting the first day of the previous month and the first day of the next month
const now = new Date()
const startOfPrevMonth = new Date(
  now.getFullYear(),
  now.getMonth() - 1
)
const endOfLastMonth = new Date(
  now.getFullYear(),
  now.getMonth(),
)
const startOfNextMonth = new Date(
  now.getFullYear(),
  now.getMonth() + 1,
)
// console.log("new Month:", startOfNextMonth)
// aggregating the monthly expense based on gte and lt which would be based on the highest date(last day of the month) and the beginning of the new month.
try {
  const getMonthlyExpense = await ExpenseModel.aggregate([{
    $match: {
      type: "expense",
      date: {
        $gte: endOfLastMonth,
        $lt: startOfNextMonth
      }
    }
  }])
  console.log()
  const getMonthlyIncome = await ExpenseModel.aggregate([{
    $match: {
      type: "income",
      date: {
        $gte: endOfLastMonth,
        $lt: startOfNextMonth
      }
    }
  }])

  const getPrevMonthlyIncome = await ExpenseModel.aggregate([{
    $match: {
      type: "income",
      date: {
        $gte: startOfPrevMonth,
        $lt: endOfLastMonth
      }
    }
  }])

  const getPrevMonthlyExpense = await ExpenseModel.aggregate([{
    $match: {
      type: "expense",
      date: {
        $gte: startOfPrevMonth,
        $lt: endOfLastMonth
      }
    }
  }])

  // calculating for the previous month
  const lastMonthIncome = getPrevMonthlyIncome.map((item, index) => item.amount).reduce((value, sum) => value + sum, 0)
  const lastMonthExpense = getPrevMonthlyExpense.map((item, index) => item.amount).reduce((value, sum) => value + sum, 0)
  const lastMonthNetBalance = lastMonthIncome - lastMonthExpense;

  // calculating for the current month
  const get_expense = getMonthlyExpense.map((item, index) => item.amount).reduce((value, sum) => value + sum, 0)
  const get_income = getMonthlyIncome.map((item, index) => item.amount).reduce((value, sum) => value + sum, 0)
  const netbalance = get_income - get_expense;

  res.status(200).json({get_expense, get_income, netbalance, lastMonthNetBalance, getMonthlyExpense, endOfLastMonth});
  
} catch (error) {
  res.status(500).json({message: "Server Error"})
  console.log(error)
}
};