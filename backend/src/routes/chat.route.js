import { Router } from "express";
import { chatGenerate } from "../controllers/chat.controller.js";


const router = Router()

router.route("/chat").post(chatGenerate)


export default router;