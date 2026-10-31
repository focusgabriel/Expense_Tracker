import {Router} from "express";
// import { authLimiter } from "../validation/authLimiter.js";
import { getBudgetCalculationController, getCreateBudgetController, getRetrieveBudgetController } from "../controllers/budget.controllers.js";
import { validate } from "../middlewares/validate.middleware.js";
import { budgetSchema } from "../validation/budget.schema.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/createBudget", authMiddleware, validate(budgetSchema),getCreateBudgetController);
router.get("/budgetExpense", authMiddleware, getBudgetCalculationController );
router.get("/getBudget", authMiddleware, getRetrieveBudgetController);

export default router;