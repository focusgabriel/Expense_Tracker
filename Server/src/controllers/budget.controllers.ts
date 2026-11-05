import { NextFunction, Request, Response } from "express";
import { budgetDto } from "../constants/index.js";
import { AppError } from "../utils/AppError.js";
import { getBudgetCalculation, getCreateBudget, getRetrieveBudget } from "../services/budget.services.js";
import { exit } from "process";

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
  const category = "transportation";

  // const now = new Date();

  //   const startOfThisMonth = new Date(
  //     now.getFullYear(),
  //     now.getMonth(),
  //     1
  //   );

  //   const startOfPrevMonth = new Date(
  //     now.getFullYear(),
  //     now.getMonth() + 1,
  //     1
  //   );

  //   const firstDayOfPreviousMonth = new Date(
  //     now.getFullYear(),
  //     now.getMonth() - 1,
  //     1
  //   );


  let budgetDerivation = await getBudgetCalculation(user, type, category);
  let budget = await getRetrieveBudget(user);

  // if(category === )

  // try using an array to get the indexed value from the definite category indexed number.
  // let GetAmount = budget.find(item => item.budgetAmount)
  let getAmount = budget.map((item) =>  item.budgetCategory.toLowerCase() === category ? item.budgetAmount : 0)[0];
  console.log(budgetDerivation);
  console.log(getAmount);
  let mappedBudget = budgetDerivation
    .map((item) => item.amount)
    .reduce((value, sum) => value + sum, 0);

  console.log("mapped:", mappedBudget);

  let percentage = ((mappedBudget / getAmount! ) * 100).toFixed(2)

  console.log("percentage", percentage)

  return res.status(200).json({mappedBudget, percentage});

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