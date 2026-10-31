import { NextFunction, Request, Response } from "express";
import { budgetDto } from "../constants/index.js";
import { AppError } from "../utils/AppError.js";
import { getBudgetCalculation, getCreateBudget } from "../services/budget.services.js";

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
  const category = "bill";

  const now = new Date();

    const startOfThisMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const startOfPrevMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    const firstDayOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );


  let budgetDerivation = await getBudgetCalculation(user, type, category, startOfThisMonth, startOfPrevMonth);

  console.log(budgetDerivation);
  let mappedBudget = budgetDerivation
    .map((item) => item.amount)
    .reduce((value, sum) => value += sum, 0);

  return res.status(200).json({mappedBudget, budgetDerivation});

}