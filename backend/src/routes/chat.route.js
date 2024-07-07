import { Router } from "express";
import { chatGenerate, getMessages, getChatList } from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.use(verifyJWT)

router.route("/generateChat").post(chatGenerate)
router.route("/chatHistory/:sessionId").get(getMessages)
router.route("/chatList").get(getChatList)
// router.route("/deleteChat").post(deleteChat)


export default router;