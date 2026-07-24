import {Router} from "express";
import { loginController, refreshTokenController, RegisterController } from "../controllers/user.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { logoutController, verifyEmailController } from "../controllers/auth.controllers.js";

import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validation/auth.schema.js";

const router = Router();

router.post("/auth/register", validate(registerSchema), RegisterController);
router.post("/auth/login", validate(loginSchema), loginController);
router.post("/refresh", refreshTokenController);
router.post("/auth/logout", authMiddleware, logoutController);
router.get("/auth/verify-email/:token",verifyEmailController);

export default router;