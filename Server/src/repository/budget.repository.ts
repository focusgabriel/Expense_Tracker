import { budgetDto } from "../constants/index.js";
import { bugdetModel, ExpenseModel } from "../model/index.js";

export async function createBudget({userId, budgetCategory, budgetAmount}: budgetDto) {
  return await bugdetModel.create({
    userId,
    budgetCategory,
    budgetAmount
  });
}

export async function BudgetCalculation(userId:string, type:string, category:string, startOfThisMonth:Date, startOfPrevMonth:Date) {
  return ExpenseModel.aggregate([{
    $match: {
      userId,
      type,
      category,
      date: {
        gte: startOfThisMonth,
        lt: startOfPrevMonth
      }
    }
  }])
}