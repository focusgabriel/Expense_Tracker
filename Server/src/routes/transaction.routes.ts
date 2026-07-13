import {Router} from "express"
import { addTransactionController, deleteTransactionController, editTransactionControler, getMonthlyIncomeController, getTransactionByIdController, getTransactionController, totalTransactionController } from "../controllers/transaction.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
const router = Router();

router.post("/addTransaction",authMiddleware, addTransactionController)
router.get("/totalTransaction",authMiddleware, totalTransactionController)
router.get("/getTransaction", authMiddleware, getTransactionController)
router.get("/getMonthlyIncome", authMiddleware, getMonthlyIncomeController)
router.get("/getTransactionById/:id",authMiddleware, getTransactionByIdController)
router.patch("/updateTransaction/:id", authMiddleware, editTransactionControler)
router.delete("/deleteTransaction/:id", authMiddleware, deleteTransactionController)

export default router