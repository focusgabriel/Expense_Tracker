import {Router} from "express";
// import { authLimiter } from "../validation/authLimiter.js";
import { getBudgetCalculationController, getCreateBudgetController, getRemoveBudgetController, getRetrieveBudgetController } from "../controllers/budget.controllers.js";
import { validate } from "../middlewares/validate.middleware.js";
import { budgetSchema } from "../validation/budget.schema.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/createBudget", authMiddleware, validate(budgetSchema),getCreateBudgetController);
router.get("/budgetExpense", authMiddleware, getBudgetCalculationController );
router.get("/getBudget", authMiddleware, getRetrieveBudgetController);
router.delete("/deleteBudget/:id", authMiddleware, getRemoveBudgetController)

export default router;