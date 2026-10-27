import { ReturnDocument } from "mongodb"
import { filterTransDto, Transaction } from "../constants/index.js"
import { ExpenseModel } from "../model/index.js"

export async function createTransaction({userId, type, amount, category, description, date, created_date}: Transaction) {
  return await ExpenseModel.create({
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
  return await ExpenseModel.findOneAndUpdate({_id, userId}, {
    $set: { type, amount, category, description, date}
  },
  ReturnDocument
)
}

export async function removeTransaction(_id: string | string[], userId: string) {
  return await ExpenseModel.findOneAndDelete({
    _id,
    userId
  })
}

export async function MonthIncome(userId:string, type: "income" | "expense",firstDayOfMonth: Date,firstDayOfNextMonth:Date){
  return await ExpenseModel.aggregate([{
    $match: {
      userId,
      type,
      date: {
        $gte: firstDayOfMonth,
        $lt: firstDayOfNextMonth,
      }
    }
  }])
}

export async function MonthExpense(userId:string, type: "income" | "expense",firstDayOfMonth: Date,firstDayOfNextMonth:Date){
  return await ExpenseModel.aggregate([{
    $match: {
      userId,
      type,
      date: {
        $gte: firstDayOfMonth,
        $lt: firstDayOfNextMonth,
      }
    }
  }]);


  // arr.push(...monIncome);

  // return arr;
}

export async function prevMonthTransactions(userId: string, firstDayOfPreviousMonth:Date, firstDayOfCurrentMonth:Date) {
  return await ExpenseModel.find({
    userId,
    date: {
      $gte: firstDayOfPreviousMonth,
      $lt: firstDayOfCurrentMonth,
    },
  })
}

export async function transactions(userId:string){
  return await ExpenseModel.find({userId});
}

export async function recentTransact(userId:string){
  return await ExpenseModel.find({userId}).sort({created_date: -1}).limit(5);
}

export async function transactionsById(_id:any, userId:string){
  return await ExpenseModel.findOne({
    _id,
    userId
  });
}

export async function prevMonthlyExpenseandIncome(userId:string, type:"income" | "expense", startOfMonth:Date, startOfAnotherMonth:Date){
  return await ExpenseModel.aggregate([{
    $match: {
      userId,
      type,
      date: {
        $gte: startOfMonth,
        $lt: startOfAnotherMonth
      }
    }
  }])
}

export async function filterTrans({filter, sortOption, skip, limitNumber}: filterTransDto){
  return await ExpenseModel
    .find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNumber)
}

export async function document(filter:any){
  return await ExpenseModel.countDocuments(filter)
}


export async function allTrans(userId: string, type:"income" | "expense"){
  return await ExpenseModel.aggregate([{
    $match: {
      userId,
      type
    }
  }])
}