import {Router} from "express"
import { addTransactionController, getTransaction, totalTransactionController } from "../controllers/transaction.controllers.js";
const router = Router();

router.post("/addTransaction", addTransactionController)
router.get("/totalTransaction", totalTransactionController)
router.get("/getTransaction", getTransaction)

export default router