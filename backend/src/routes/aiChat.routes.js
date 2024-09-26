import { Router } from "express";
import { createAiChat } from "../controllers/aiChat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = new Router();

router.route("/create-aichat/:id").post(verifyJWT, createAiChat);

export default router;
