import {Router} from "express";
import { loginController, refreshTokenController, RegisterController } from "../controllers/user.controllers.js";

const router = Router();

router.post("/auth/register", RegisterController);
router.post("/auth/login", loginController);
router.post("/refresh", refreshTokenController);

export default router;