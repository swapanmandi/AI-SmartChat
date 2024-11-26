import { Router } from "express";
import { createAiChat, getAiMessages } from "../controllers/aiMessage.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-chat/:id").post(verifyJWT, createAiChat);
router.route("/get-messages/:id").get(verifyJWT, getAiMessages)
export default router;
