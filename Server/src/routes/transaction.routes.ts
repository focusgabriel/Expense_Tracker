import {Router} from "express"
import { addTransactionController, deleteTransactionController, editTransactionControler, getMonthlyIncomeController, getTransactionByIdController, getTransactionController, totalTransactionController } from "../controllers/transaction.controllers.js";
const router = Router();

router.post("/addTransaction", addTransactionController)
router.get("/totalTransaction", totalTransactionController)
router.get("/getTransaction", getTransactionController)
router.get("/getMonthlyIncome", getMonthlyIncomeController)
router.get("/getTransactionById/:id", getTransactionByIdController)
router.patch("/updateTransaction/:id", editTransactionControler)
router.delete("/deleteTransaction/:id", deleteTransactionController)

export default router