import { Router } from "express";
import {getChatUsers, createOrGetOneOnOneChat } from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.use(verifyJWT)

// router.route("/generateChat/:id").post(chatGenerate)
// router.route("/chatHistory/:id").get(getMessages)
// router.route("/chatList").get(getChatList)
// router.route("/deleteChat/:id").delete(deleteChat)

router.route("/chat-users").get(verifyJWT, getChatUsers)
router.route("/oneononechat/:id").post(verifyJWT, createOrGetOneOnOneChat)


export default router;