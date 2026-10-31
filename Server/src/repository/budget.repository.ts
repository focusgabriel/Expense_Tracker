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
  return await budgetModel.find({userId});
}

export async function BudgetCalculation(userId:string, type:string, category:string) {
  return ExpenseModel.aggregate([{
    $match: {
      userId,
      type,
      category,
    }
  }])
}