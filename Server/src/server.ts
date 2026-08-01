import express, { Request, Response, Application } from 'express';
// import dotenv from 'dotenv'
import mongoose from "mongoose";
import cors from "cors";
import { transactionRouter, userRouter } from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { limiter } from './validation/limiter.js';
import helmet from "helmet";
import cookieParser from "cookie-parser";

// dotenv.config();

const mongo_uri = process.env.MONGO_URI
const PORT = process.env.PORT || 3000;

if(!mongo_uri){
  throw new Error("Can't connect to MongoDB");
} 
mongoose.connect(mongo_uri)

const app: Application = express();

app.set('trust proxy', 1);

app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(cookieParser());

app.use("/api/v1/", limiter, transactionRouter);
app.use("/api/v1/", userRouter);
app.use(errorHandler);

app.get("/health", async(_req:Request, res:Response) => {
  try{
    res.status(200).json({status: "ok", database: "Connected"});
  } catch(error) {
    console.error(error);
    res.status(400).json({status: "failed", database: "Disconnected"});
  }
})


app.listen(PORT, () => {
  console.log(`🚀 Express server is running on http://localhost:${PORT}`);
});