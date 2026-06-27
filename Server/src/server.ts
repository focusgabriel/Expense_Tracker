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
mongoose.connect(mongo_uri);

const app: Application = express();
app.use(express.json());

type ExpenseSchema = {
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: Date;
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
    type: Date,
    required: true,
  },

  created_date: {
    type: Date,
    required: true,
  },
})

const ExpenseModel = mongoose.model("expenditures", ExpenseProps)

export async function addTransaction(type:"income" | "expense", amount:number, category:string, description:string, date:Date, created_date:Date){
    const newTransaction = new ExpenseModel({
    type,
    amount, 
    category,
    description, 
    date, 
    created_date
  })

  await newTransaction.save();
  console.log(newTransaction);
  return newTransaction;
  }

app.post("/api/v1/addTransaction", async function(req:Request, res:Response){
  try {
    const {type, amount, category, description, date, created_date=Date.now()} = req.body
    await addTransaction(type, amount, category, description, date, created_date);
    res.status(201).json({message: "Transaction added Successfully"});
  } catch (error) {
    console.log("Error Message:", error)
    res.status(500).json({message: "Error Occurred while adding Transaction"})
  }
});


app.get("/api/v1/totalTransaction", async function(req:Request, res:Response){
  try {
    const income = await ExpenseModel.find({type:"income"})
    const Total_income = income.reduce((value, sum) => value + sum.amount, 0);

    res.status(200).json(Total_income);
    console.log(`Total income: ${Total_income}`);
    
    const expense = await ExpenseModel.find({type:"expense"})
    const Total_expense = expense.reduce((value, sum) => value + sum.amount, 0);
    res.status(200).json(Total_expense);
    console.log(`Total expense: ${Total_expense}`);
    
    const NetBalance = Total_income - Total_expense;
    res.status(200).json({message: NetBalance});
    console.log("Net Balance:", NetBalance);

    res.status(200).json({Total_income, Total_expense, NetBalance});
  } catch (error) {
    console.log("Error:", error)
  }
  
});

app.get("/api/v1/getTransaction", async function(req:Request, res:Response){
  try{
    const allTransactions = await ExpenseModel.find();
    res.status(200).json({message:"successfully returned all data"})
    console.log(allTransactions)

  } catch(err){
    res.status(500).json({message:"error loading data"})
    console.log("error:",err);
  }
})

app.use(
  cors({
    origin: "*"
  })
)

app.listen(PORT, () => {
  console.log(`🚀 Express server is running on http://localhost:${PORT}`);
});