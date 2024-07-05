import { Router } from "express";
import { chatGenerate, chat, getMessages } from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.use(verifyJWT)

router.route("/generateChat").post(chatGenerate)
router.route("/createChat/:id").post(chat)
// router.route("/deleteChat").post(deleteChat)
router.route("/getChat/:id").get(getMessages)


export default router;