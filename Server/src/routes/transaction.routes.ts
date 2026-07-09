import {Router} from "express"
import { addTransactionController } from "../controllers/transaction.controllers.js";
const router = Router();

router.post("/", addTransactionController)