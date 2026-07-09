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