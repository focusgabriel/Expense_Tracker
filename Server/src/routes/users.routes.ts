import {Router} from "express";
import { loginController, refreshTokenController, RegisterController } from "../controllers/user.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { logoutController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/auth/register", RegisterController);
router.post("/auth/login", loginController);
router.post("/refresh", refreshTokenController);
router.post("/auth/logout", authMiddleware, logoutController);

export default router;