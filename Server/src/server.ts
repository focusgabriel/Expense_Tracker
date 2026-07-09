import express, { Request, Response, Application } from 'express';
// import dotenv from 'dotenv'
import mongoose from "mongoose";
import cors from "cors";
import { transactionRouter } from './routes/index.js';

// dotenv.config();

const mongo_uri = process.env.MONGO_URI
const PORT = process.env.PORT || 3000;

if(!mongo_uri){
  throw new Error("Can't connect to MongoDB");
} 
mongoose.connect(mongo_uri)

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({origin: "*"}));

// type ExpenseSchema = {
//   type: "income" | "expense";
//   amount: number;
//   category: string;
//   description: string;
//   date: Date;
//   created_date: Date;
// }

// const ExpenseProps = new mongoose.Schema<ExpenseSchema>({
//   type: {
//     type: String,
//     required: true,
//   },

//   amount: {
//     type: Number,
//     required: true,
//   },

//   category: {
//     type: String,
//     required: true,
//   },

//   description: {
//     type: String,
//     required: true,
//   },

//   date: {
//     type: Date,
//     required: true,
//   },

//   created_date: {
//     type: Date,
//     required: true,
//   },
// })

// const ExpenseModel = mongoose.model("expenseRecords", ExpenseProps);

// export async function addTransaction(type:"income" | "expense", amount:number, category:string, description:string, date:Date, created_date:Date){
//     const newTransaction = new ExpenseModel({
//     type,
//     amount, 
//     category,
//     description, 
//     date, 
//     created_date,
//   })

//   await newTransaction.save();
//   // console.log(newTransaction);
//   return newTransaction;
//   }

// app.post("/api/v1/addTransaction", async function(req:Request, res:Response){
//   try {
//     const {type, amount, category, description, date, created_date=new Date()} = req.body
//     await addTransaction(type, amount, category, description, date, created_date);
//     res.status(201).json({type, amount, category, description, date, created_date});
//   } catch (error) {
//     console.log("Error Message:", error)
//     res.status(500).json({message: "Error Occurred while adding Transaction"})
//   }
// });

// app.get("/api/v1/totalTransaction", async function(req:Request, res:Response){
//   try {
//     const income = await ExpenseModel.find({type:"income"})
//     const Total_income = income.reduce((value, sum) => value + sum.amount, 0);
    
//     const expense = await ExpenseModel.find({type:"expense"})
//     const Total_expense = expense.reduce((value, sum) => value + sum.amount, 0);
    
//     const NetBalance = Total_income - Total_expense;
//     res.status(200).json({Total_income, Total_expense, NetBalance});
//   } catch (error) {
//     console.log("Error:", error)
//   }
  
// });

// // }

// // app.get("/api/v1/getPercentage", async function(req:Request, res:Response) {
// //   try{
// //     const data = await ExpenseModel.find({"category": "Bill"});
// //     const totalData = data.reduce((value, sum) => value + sum.amount, 0);
// //     res.status(200).json({totalData});
// //     console.log("total data:",totalData);
// //   } catch(error) {
// //     console.log("error:", error)
// //   }
// // })

// // app.get("/api/v1/getPercentage", async function(req:Request, res:Response) {
// //   try{
// //     const income = await ExpenseModel.find({type:"income"});
// //     const food = await ExpenseModel.find({category: /Transportation/i});
// //     const Total_income = income.reduce((value, sum) => value + sum.amount, 0);
// //     const totalFood = food.reduce((value, sum) => value + sum.amount, 0);
// //     const perTotal = totalFood / Total_income * 100
// //     const total = Number(perTotal.toFixed(2));
// //     res.status(200).json({total});
// //     console.log("total food:",totalFood);
// //     console.log("total percentage:",perTotal);
// //     console.log("total:",total);
// //   } catch(error) {
// //     console.log("error:", error)
// //   }
// // })


// app.get("/api/v1/getTransaction", async function(req:Request, res:Response){
//   try{
//     const allTransactions = await ExpenseModel.find().sort({created_date: -1})
//     res.status(200).json(allTransactions)
//     console.log(allTransactions)

//   } catch(err){
//     res.status(500).json({message:"error loading data"})
//     console.log("error:",err);
//   }
// })

// app.get("/api/v1/getMonthlyIncome", async function(req:Request, res:Response) {
// // getting the first day of the previous month and the first day of the next month
// const now = new Date()
// const startOfPrevMonth = new Date(
//   now.getFullYear(),
//   now.getMonth() - 1
// )
// const endOfLastMonth = new Date(
//   now.getFullYear(),
//   now.getMonth(),
// )
// const startOfNextMonth = new Date(
//   now.getFullYear(),
//   now.getMonth() + 1,
// )
// // console.log("new Month:", startOfNextMonth)
// // aggregating the monthly expense based on gte and lt which would be based on the highest date(last day of the month) and the beginning of the new month.
// try {
//   const getMonthlyExpense = await ExpenseModel.aggregate([{
//     $match: {
//       type: "expense",
//       date: {
//         $gte: endOfLastMonth,
//         $lt: startOfNextMonth
//       }
//     }
//   }])
//   console.log()
//   const getMonthlyIncome = await ExpenseModel.aggregate([{
//     $match: {
//       type: "income",
//       date: {
//         $gte: endOfLastMonth,
//         $lt: startOfNextMonth
//       }
//     }
//   }])

//   const getPrevMonthlyIncome = await ExpenseModel.aggregate([{
//     $match: {
//       type: "income",
//       date: {
//         $gte: startOfPrevMonth,
//         $lt: endOfLastMonth
//       }
//     }
//   }])

//   const getPrevMonthlyExpense = await ExpenseModel.aggregate([{
//     $match: {
//       type: "expense",
//       date: {
//         $gte: startOfPrevMonth,
//         $lt: endOfLastMonth
//       }
//     }
//   }])

//   // calculating for the previous month
//   const lastMonthIncome = getPrevMonthlyIncome.map((item, index) => item.amount).reduce((value, sum) => value + sum, 0)
//   const lastMonthExpense = getPrevMonthlyExpense.map((item, index) => item.amount).reduce((value, sum) => value + sum, 0)
//   const lastMonthNetBalance = lastMonthIncome - lastMonthExpense;

//   // calculating for the current month
//   const get_expense = getMonthlyExpense.map((item, index) => item.amount).reduce((value, sum) => value + sum, 0)
//   const get_income = getMonthlyIncome.map((item, index) => item.amount).reduce((value, sum) => value + sum, 0)
//   const netbalance = get_income - get_expense;

//   res.status(200).json({get_expense, get_income, netbalance, lastMonthNetBalance, getMonthlyExpense, endOfLastMonth});
  
// } catch (error) {
//   res.status(500).json({message: "Server Error"})
//   console.log(error)
// }
// })

app.get("/health", async(_req:Request, res:Response) => {
  try{
    await mongoose.connect(mongo_uri)
    res.status(200).json({status: "ok", database: "Connected"});
  } catch(error) {
    console.error(error);
    res.status(400).json({status: "failed", database: "Disconnected"});
  }
})

app.use("/api/v1/", transactionRouter);

app.listen(PORT, () => {
  console.log(`🚀 Express server is running on http://localhost:${PORT}`);
});