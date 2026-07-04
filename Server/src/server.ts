import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv'
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

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

type ExpenseSchema = {
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  created_date: Date;
}

const ExpenseProps = new mongoose.Schema<ExpenseSchema>({
  type: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  created_date: {
    type: Date,
    required: true,
  },
})

const ExpenseModel = mongoose.model("expenditures", ExpenseProps);

export async function addTransaction(type:"income" | "expense", amount:number, category:string, description:string, date:Date, created_date:Date){
    const newTransaction = new ExpenseModel({
    type,
    amount, 
    category,
    description, 
    date, 
    created_date,
  })

  await newTransaction.save();
  // console.log(newTransaction);
  return newTransaction;
  }

app.post("/api/v1/addTransaction", async function(req:Request, res:Response){
  try {
    const {type, amount, category, description, date, created_date=new Date()} = req.body
    await addTransaction(type, amount, category, description, date, created_date);
    res.status(201).json({type, amount, category, description, date, created_date});
  } catch (error) {
    console.log("Error Message:", error)
    res.status(500).json({message: "Error Occurred while adding Transaction"})
  }
});

// const newDate = new Date();
// let getDate = newDate.getDate();
// console.log(getDate)

// if(getDate === 5){
  app.get("/api/v1/totalTransaction", async function(req:Request, res:Response){
  try {
    const Total_income =0
    const Total_expense = 0
    
    const NetBalance = Total_income - Total_expense;

    res.status(200).json({Total_income, Total_expense, NetBalance});
  } catch (error) {
    console.log("Error:", error)
  }
  
});

// } else {
app.get("/api/v1/totalTransaction", async function(req:Request, res:Response){
  try {
    const income = await ExpenseModel.find({type:"income"})
    const Total_income = income.reduce((value, sum) => value + sum.amount, 0);

    // res.status(200).json(Total_income);
    console.log(`Total income: ${Total_income}`);
    
    const expense = await ExpenseModel.find({type:"expense"})
    const Total_expense = expense.reduce((value, sum) => value + sum.amount, 0);
    // res.status(200).json(Total_expense);
    console.log(`Total expense: ${Total_expense}`);
    
    const NetBalance = Total_income - Total_expense;
    // res.status(200).json({message: NetBalance});
    console.log("Net Balance:", NetBalance);

    res.status(200).json({Total_income, Total_expense, NetBalance});
  } catch (error) {
    console.log("Error:", error)
  }
  
});

// }

// app.get("/api/v1/getPercentage", async function(req:Request, res:Response) {
//   try{
//     const data = await ExpenseModel.find({"category": "Bill"});
//     const totalData = data.reduce((value, sum) => value + sum.amount, 0);
//     res.status(200).json({totalData});
//     console.log("total data:",totalData);
//   } catch(error) {
//     console.log("error:", error)
//   }
// })

// app.get("/api/v1/getPercentage", async function(req:Request, res:Response) {
//   try{
//     const income = await ExpenseModel.find({type:"income"});
//     const food = await ExpenseModel.find({category: /Transportation/i});
//     const Total_income = income.reduce((value, sum) => value + sum.amount, 0);
//     const totalFood = food.reduce((value, sum) => value + sum.amount, 0);
//     const perTotal = totalFood / Total_income * 100
//     const total = Number(perTotal.toFixed(2));
//     res.status(200).json({total});
//     console.log("total food:",totalFood);
//     console.log("total percentage:",perTotal);
//     console.log("total:",total);
//   } catch(error) {
//     console.log("error:", error)
//   }
// })


app.get("/api/v1/getTransaction", async function(req:Request, res:Response){
  try{
    const allTransactions = await ExpenseModel.find().sort({created_date: -1})
    res.status(200).json(allTransactions)
    console.log(allTransactions)

  } catch(err){
    res.status(500).json({message:"error loading data"})
    console.log("error:",err);
  }
})

app.get("/api/v1/getMonthlyIncome", async function(req:Request, res:Response) {
// get the whole date first
const lastMonth = new Date("2026-06-01")
const newMonth = new Date("2026-07-01")

try {
  // const getDate = (await ExpenseModel.find()).filter((item, index) => item.date).map((item, index) => item.date)

// check when it gets to a new month -> 1st of the month
  const getMonth = await ExpenseModel.aggregate([{
    $match: {
      type: "expense",
      date: {
        $gte: lastMonth,
        $lt: newMonth
      }
    }
  }])

  const get_date = getMonth.map((item, index) => item.amount).reduce((value, sum) => value + sum)
  res.status(200).json(get_date);
  
} catch (error) {
  res.status(500).json({message: "Server Error"})
  console.log(error)
}
// start calculating the amount from there 
})

app.listen(PORT, () => {
  console.log(`🚀 Express server is running on http://localhost:${PORT}`);
});