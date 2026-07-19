import express, { Request, Response, Application } from 'express';
// import dotenv from 'dotenv'
import mongoose from "mongoose";
import cors from "cors";
import { transactionRouter, userRouter } from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

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

app.get("/health", async(_req:Request, res:Response) => {
  try{
    res.status(200).json({status: "ok", database: "Connected"});
  } catch(error) {
    console.error(error);
    res.status(400).json({status: "failed", database: "Disconnected"});
  }
})

app.use("/api/v1/", transactionRouter);
app.use("/api/v1/", userRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Express server is running on http://localhost:${PORT}`);
});