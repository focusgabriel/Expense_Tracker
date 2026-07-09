import {Router} from "express"
import { addTransactionController, totalTransactionController } from "../controllers/transaction.controllers.js";
const router = Router();

router.post("/", addTransactionController)
router.get("/", totalTransactionController)

export default router