import express, { Request, Response, Application, NextFunction } from 'express';
import { addTransaction, deleteTransaction, editTransaction } from "../services/transaction.services.js";
import { ExpenseModel, authModel } from '../model/index.js';
import { CATEGORY_COLORS } from '../constants/index.js';
import { AppError } from '../utils/AppError.js';

export async function addTransactionController(req:Request, res:Response, next:NextFunction){
  try {
    const {type, amount, category, description, date= new Date(), created_date=new Date()} = req.body
    
    if(amount < 100){
      return res.status(400).json({
        message: "Amount should be greater than 100",
      })
    } 
    const transaction = await ExpenseModel.create({
      userId: req.user!.id,
      type,
      amount,
      category,
      description,
      date,
      created_date,
    });
    res.status(201).json(transaction);

  } catch (error) {
    next();
  }
};

export async function totalTransactionController(req:Request, res:Response, next:NextFunction){
  try {
    const income = await ExpenseModel.aggregate([{
      $match: {
        userId: req.user!.id,
        type: "income"
      }
    }])
    const Total_income = income.reduce((value, sum) => value + sum.amount, 0);
    
    const expense = await ExpenseModel.aggregate([{
      $match: {
        userId: req.user!.id,
        type: "expense"
      }
    }])
    const Total_expense = expense.reduce((value, sum) => value + sum.amount, 0);
    
    const NetBalance = Total_income - Total_expense;
    res.status(200).json({Total_income, Total_expense, NetBalance});
  } catch (error:any) {
    next();
  }
  
};

export async function getTransactionController(req:Request, res:Response, next:NextFunction){
  // filteration implementation.
  try{
    const { page, limit, search, type, category, sort, order } = req.query;
    const filter:any = {
      userId: req.user!.id,
    }

    if(type){
      filter.type = type;
    }

    if(category){
      filter.category = category;
    }

    if(search){
      filter.$or = [
        {
          description: {
            $regex: search,
            $options: "i"
          }
        },

        {
          category: {
            $regex: search,
            $options: "i"
          }
        }
      ]
    };

    const sortOption: Record<string, 1 | -1> = {
      created_date: -1
    }

    if(sort){
      sortOption[sort as string] = order === "asc" ? 1 : -1;
    }

    // pagination logic implementation

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;
    const transactions = await ExpenseModel
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const total = await ExpenseModel.countDocuments(filter);

    res.status(200).json({
      data: transactions,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalLimit: Math.ceil(total / limitNumber)
      }
    });

  } catch(err){
    next();
  }
};

export async function getMonthlyIncomeController(req:Request, res:Response, next:NextFunction) {
  const monthQuery = typeof req.query.month === 'string' ? req.query.month : undefined;
  const now = new Date();
  let selectedYear = now.getFullYear();
  let selectedMonth = now.getMonth();

  if (monthQuery && /^\d{4}-\d{2}$/.test(monthQuery)) {
    const [year, month] = monthQuery.split('-').map(Number);
    selectedYear = year!;
    selectedMonth = month! - 1;
  }

  const startOfSelectedMonth = new Date(selectedYear, selectedMonth, 1);
  const startOfNextMonth = new Date(selectedYear, selectedMonth + 1, 1);
  const startOfPreviousMonth = new Date(selectedYear, selectedMonth - 1, 1);
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  try {
    const getMonthlyExpense = await ExpenseModel.aggregate([{
      $match: {
        userId: req.user!.id,
        type: "expense",
        date: {
          $gte: startOfSelectedMonth,
          $lt: startOfNextMonth
        }
      }
    }])

    const getMonthlyIncome = await ExpenseModel.aggregate([{
      $match: {
        userId: req.user!.id,
        type: "income",
        date: {
          $gte: startOfSelectedMonth,
          $lt: startOfNextMonth
        }
      }
    }])

    const getPrevMonthlyIncome = await ExpenseModel.aggregate([{
      $match: {
        userId: req.user!.id,
        type: "income",
        date: {
          $gte: startOfPreviousMonth,
          $lt: startOfSelectedMonth
        }
      }
    }])

    const getPrevMonthlyExpense = await ExpenseModel.aggregate([{
      $match: {
        userId: req.user!.id,
        type: "expense",
        date: {
          $gte: startOfPreviousMonth,
          $lt: startOfSelectedMonth
        }
      }
    }])

    const lastMonthIncome = getPrevMonthlyIncome.map((item) => item.amount).reduce((value, sum) => value + sum, 0)
    const lastMonthExpense = getPrevMonthlyExpense.map((item) => item.amount).reduce((value, sum) => value + sum, 0)
    const lastMonthNetBalance = lastMonthIncome - lastMonthExpense;

    const get_expense = getMonthlyExpense.map((item) => item.amount).reduce((value, sum) => value + sum, 0)
    const get_income = getMonthlyIncome.map((item) => item.amount).reduce((value, sum) => value + sum, 0)
    const netbalance = get_income - get_expense;

    res.status(200).json({
      get_expense,
      get_income,
      netbalance,
      lastMonthNetBalance,
      getMonthlyExpense,
      endOfLastMonth: startOfNextMonth,
      month: monthQuery || `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`,
      selectedMonthStart: startOfSelectedMonth,
      selectedMonthEnd: startOfNextMonth,
      isCurrentMonth: startOfSelectedMonth.getTime() === startOfCurrentMonth.getTime(),
    });
  } catch (error) {
    next();
  }
};

export async function editTransactionControler(req:Request, res:Response, next:NextFunction) {
  const { id } = req.params;
  const userId = req.user!.id;
  const {type, amount, category, description, date} = req.body

  try {
    if (!id ) {
      return res.status(400).json({ error: "Transaction ID is required" });
    }

    if(amount < 100){
      return res.status(400).json({error: "Amount should be greater than 100"});
    }
    
    const updatedTransaction = await editTransaction(id, userId, type, amount, category, description, date);
    
    if (!updatedTransaction) {
      throw new AppError("Transaction not found", 404);
    }

    res.status(200).json(updatedTransaction)
  } catch (error) {
    next();
  }
}

export async function getTransactionByIdController(req:Request, res:Response, next:NextFunction) {
  const transactionId = await ExpenseModel.findOne({_id:req.params.id, userId:req.user!.id})

  try {
    if(!transactionId) {
      return res.status(400).json({message: "No Transaction"})
    } 
    res.status(200).json(transactionId)
    
  } catch (error) {
    next();
  }
}

export async function deleteTransactionController(req:Request, res:Response, next:NextFunction) {
  try {
    // const {id} = req.params
    const delTransaction = await deleteTransaction(req.params.id, req.user!.id);
    if(!delTransaction) {
      throw new AppError("couldn't find transaction", 404);
    }
    res.status(200).json(delTransaction)
  } catch (error:any) {
    next();
  }
}

export async function dashboardController(req:Request, res:Response, next:NextFunction) {
  
  try {
    const authenticatedUser = await authModel.findById(req.user!.id).select("name email");
    const userId = req.user!.id;
    const recentTransactions = await ExpenseModel.find({userId}).sort({created_date: -1}).limit(5)
    
    const totalTransactions = await ExpenseModel.find({userId})

    const totalIncome = totalTransactions
      .filter(item => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const totalExpense = totalTransactions
      .filter(item => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    const netBalance = totalIncome - totalExpense;
    
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

    const firstDayOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    const firstDayOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    // Date for display — last day of previous month (matches what getMonthlyIncomeController returns)
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0
    ).toISOString();

    const previousMonthTransactions = await ExpenseModel.find({
      userId,
      date: {
        $gte: firstDayOfPreviousMonth,
        $lt: firstDayOfCurrentMonth,
      },
    });

    const previousMonthIncome = previousMonthTransactions
      .filter(item => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const previousMonthExpense = previousMonthTransactions
      .filter(item => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    
    const previousMonthBalance = previousMonthIncome - previousMonthExpense;
    
    const totalMonthlyExpense = await ExpenseModel.aggregate([{
    $match: {
      userId: req.user!.id,
      type: "expense",
      date: {
        $gte: firstDayOfMonth,
        $lt: firstDayOfNextMonth
      }
    }
  }]);

  const totalMonthlyIncome = await ExpenseModel.aggregate([{
    $match: {
      userId: req.user!.id,
      type: "income",
      date: {
        $gte: firstDayOfMonth,
        $lt: firstDayOfNextMonth
      }
    }
  }]);

    const monthlyIncome = totalMonthlyIncome
      .reduce((sum, item) => sum + item.amount, 0);

    const monthlyExpense = totalMonthlyExpense
      .reduce((sum, item) => sum + item.amount, 0);

    const monthlyBalance = monthlyIncome - monthlyExpense;

    const groupedExpenses = totalMonthlyExpense
      .reduce<Record<string, number>>((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
        return acc;
      }, {});

      const get_expense = totalMonthlyExpense.map((item, index) => item.amount).reduce((value, sum) => value + sum, 0);

      const get_income = totalMonthlyIncome.map((item, index) => item.amount).reduce((value, sum) => value + sum, 0);
    
    // const getBalance = get_income - get_expense;

    const chartData = Object.entries(groupedExpenses).map(
      ([category, amount]) => ({
        category,
        amount,
        percentage: (amount / get_income) * 100,
        fill: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] ?? "#07023A"
      })
    );


    return res.status(200).json({
      summary: {
        totalIncome,
        totalExpense,
        netBalance,

        monthlyIncome,
        monthlyExpense,
        monthlyBalance,

        // previousMonthBalance,
        previousMonthIncome,  
        previousMonthExpense,
        previousMonthBalance
      },
      get_expense,
      get_income,
      // getBalance
      monthlyBalance,
      firstDayOfCurrentMonth,

      recentTransactions,
      chartData,

      authenticatedUser
    })
    
  } catch {
    next();
  }

  
}

// export async function getAllUserDataController(req: Request, res: Response) {
//   try {
//     const userId = req.user!.id;

//     // Get user profile information
//     const userProfile = await authModel.findById(userId).select('-password');

//     // Get all transactions for the user
//     const allTransactions = await ExpenseModel.find({ userId }).sort({ created_date: -1 });

//     // Calculate summary statistics
//     const income = await ExpenseModel.find({ userId, type: "income" });
//     const totalIncome = income.reduce((sum, trans) => sum + trans.amount, 0);

//     const expense = await ExpenseModel.find({ userId, type: "expense" });
//     const totalExpense = expense.reduce((sum, trans) => sum + trans.amount, 0);

//     const netBalance = totalIncome - totalExpense;

//     res.status(200).json({
//       user: userProfile,
//       transactions: allTransactions,
//       summary: {
//         totalIncome,
//         totalExpense,
//         netBalance,
//         totalTransactions: allTransactions.length
//       }
//     });
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     res.status(500).json({ message: "Error fetching user data" });
//   }
// }