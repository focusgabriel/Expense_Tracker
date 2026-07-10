import {Router} from "express"
import { addTransactionController, editTransactionControler, getMonthlyIncomeController, getTransactionByIdController, getTransactionController, totalTransactionController } from "../controllers/transaction.controllers.js";
const router = Router();

router.post("/addTransaction", addTransactionController)
router.get("/totalTransaction", totalTransactionController)
router.get("/getTransaction", getTransactionController)
router.get("/getMonthlyIncome", getMonthlyIncomeController)
router.patch("/", editTransactionControler)
router.get("/getTransactionById/:id", getTransactionByIdController)

export default router