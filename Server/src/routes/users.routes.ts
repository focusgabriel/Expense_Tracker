import {Router} from "express";
import { loginController, RegisterController } from "../controllers/user.controllers.js";

const router = Router();

router.post("/auth/register", RegisterController);
router.post("/auth/login", loginController);

export default router;