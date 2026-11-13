import { budgetDto } from "../constants/index.js";
import { budgetModel, ExpenseModel } from "../model/index.js";

export async function createBudget({userId, budgetCategory, budgetAmount}: budgetDto) {
  return await budgetModel.create({
    userId,
    budgetCategory,
    budgetAmount
  });
}

export async function retrieveBudget(userId:string) {
  return await budgetModel.find({userId})
}

export async function BudgetCalculation(userId:string, type:string, firstDayOfMonth:Date, firstDayOfNextMonth:Date) {
  return ExpenseModel.aggregate([{
    $match: {
      userId,
      type,
      date: {
        $gte: firstDayOfMonth,
        $lt: firstDayOfNextMonth
      }
    }
  }, {
    $group: {
      _id: "$category",
      amount: { $sum: "$amount" }
    }
  }])
}

export async function removeBudget(id:string | string[], userId:string){
  return await budgetModel.findOneAndDelete({
    _id:id, userId
  });
}