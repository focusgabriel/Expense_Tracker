import { ReturnDocument } from "mongodb"
import { Transaction } from "../constants/index.js"
import { ExpenseModel } from "../model/index.js"


export async function createTransaction({userId, type, amount, category, description, date, created_date}: Transaction) {
  await ExpenseModel.create({
    userId,
    type,
    amount,
    category,
    description,
    date,
    created_date
  })
}

export async function modifyTransaction({_id, userId, type, amount, category, description, date}: Transaction) {
  await ExpenseModel.findOneAndUpdate({_id, userId}, {
    $set: { type, amount, category, description, date}
  },
  ReturnDocument
)
}

export async function removeTransaction(_id: string | string[], userId: string) {
  await ExpenseModel.findOneAndDelete({
    _id,
    userId
  })
}