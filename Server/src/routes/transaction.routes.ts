import {Router} from "express"
import { addTransactionController, dashboardController, deleteTransactionController, editTransactionControler, getMonthlyIncomeController, getTransactionByIdController, getTransactionController, totalTransactionController } from "../controllers/transaction.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { transactionSchema } from "../validation/transaction.schema.js";
import { validate } from "../middlewares/validate.middleware.js";
const router = Router();

router.post("/addTransaction",authMiddleware,  validate(transactionSchema),
 addTransactionController)
router.get("/totalTransaction",authMiddleware, totalTransactionController)
router.get("/getTransaction", authMiddleware, getTransactionController)
router.get("/getMonthlyIncome", authMiddleware, getMonthlyIncomeController)
router.get("/getTransactionById/:id",authMiddleware, getTransactionByIdController)
// router.get("/getAllUserData", authMiddleware, getAllUserDataController)
router.patch("/updateTransaction/:id", authMiddleware, editTransactionControler)
router.delete("/deleteTransaction/:id", authMiddleware, deleteTransactionController)
router.get("/dashboard", authMiddleware, dashboardController);

export default router