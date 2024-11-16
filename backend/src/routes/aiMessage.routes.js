import { Router } from "express";
import { createAiChat } from "../controllers/aiMessage.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/ai-chat/:id").post(verifyJWT, createAiChat);

export default router;
