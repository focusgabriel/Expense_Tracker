import {Router} from "express"
import { addTransactionController, getMonthlyIncome, getTransaction, totalTransactionController } from "../controllers/transaction.controllers.js";
const router = Router();

router.post("/addTransaction", addTransactionController)
router.get("/totalTransaction", totalTransactionController)
router.get("/getTransaction", getTransaction)
router.get("/getMonthlyIncome", getMonthlyIncome)

export default router