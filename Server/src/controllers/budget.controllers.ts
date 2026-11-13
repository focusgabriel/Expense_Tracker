import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { getBudgetCalculation, getCreateBudget, getRemoveBudget, getRetrieveBudget } from "../services/budget.services.js";
import { string } from "zod";

export async function getCreateBudgetController(req:Request, res:Response, next: NextFunction) {
  const userId = req.user!.id
  const {budgetCategory, budgetAmount} = req.body

  if(!userId) {
    throw new AppError("User is not recognized", 403)
  }

  await getCreateBudget({
    userId,
    budgetCategory,
    budgetAmount  
  })

  return res.status(201).json({
    budgetList: {
      category: budgetCategory,
      amount: budgetAmount
    }
  })
}


export async function getBudgetCalculationController(req:Request, res:Response, next:NextFunction){
  const user = req.user!.id;
  const type = "expense";
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const firstDayOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    const [budgets, expensesByCategory] = await Promise.all([
      getRetrieveBudget(user),
      getBudgetCalculation(user, type, firstDayOfMonth, firstDayOfNextMonth)
    ]);

    const expenseMap = new Map<string, number>(
      expensesByCategory.map((item: any) => [item._id.toLowerCase(), item.amount])
    );

    const result = budgets.map((budget: any) => {
      const budgetId = budget._id;
      const category = budget.budgetCategory;
      const budgetAmount = budget.budgetAmount;
      const spent = expenseMap.get(category.toLowerCase()) || 0;
      const percentage = budgetAmount > 0
        ? parseFloat(((spent / budgetAmount) * 100).toFixed(2))
        : 0;

      return {
        budgetId,
        budgetCategory: category,
        amount: spent,
        percentage,
        budgetAmount
      };
    });

    console.log(result)
    return res.status(200).json(result);
  } catch (error) {
    next(error);
    throw new AppError("Nothing Found", 404);
}
}


export async function getRetrieveBudgetController(req:Request, res:Response, next:NextFunction) {
  try {
    const user = req.user!.id

    let retrievedBudget = await getRetrieveBudget(user);

    return res.status(200).json(retrievedBudget);
  } catch (error) {
    next();
    return res.status(500).json({
      success: false,
      message: "couldn't find Budgets."
    })
  }
}

export async function getRemoveBudgetController(req:Request, res:Response, next:NextFunction) {
  try {
    const userId = req.user!.id;
    const {id} = req.params

    await getRemoveBudget(id, userId);

    return res.status(200).json({
      success:true,
      message: "item deleted Successfully"
    });
  } catch (error) {
    next(error)
  }
}