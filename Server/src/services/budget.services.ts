import { budgetDto } from "../constants/index.js";
import { BudgetCalculation, createBudget } from "../repository/budget.repository.js";

export async function getCreateBudget({userId, budgetCategory, budgetAmount}: budgetDto) {

  if(budgetCategory === "" || !budgetAmount) {
    throw new Error("Budget Category, Budget Amount are required");
  }

  let budgets = await createBudget({
    userId, 
    budgetCategory,
    budgetAmount
  });

  if(!budgets) {
    throw new Error("Failed to Create Budget");
  }

  return budgets;
}

export async function getBudgetCalculation(userId: string, type: string, category: string,startOfThisMonth:Date, startOfPrevMonth:Date){

  if(!userId || type === "" || category === "") {
    throw new Error("Fields are Required...");
  }
  let calc = await BudgetCalculation(userId, type, category, startOfThisMonth, startOfPrevMonth);

  if(!calc) {
    throw new Error("nothing to display")
  }

  return calc;
}