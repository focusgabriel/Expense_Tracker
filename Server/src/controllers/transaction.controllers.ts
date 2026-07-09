import express, { Request, Response, Application } from 'express';
import { addTransaction } from "../services/transaction.services.js";

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