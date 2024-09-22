import { sendMessage, getMessages, deleteMessage } from "../controllers/message.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = new Router();

router.route("/create-message/:id").post(verifyJWT, sendMessage);
router.route("/get-messages/:id").get(verifyJWT, getMessages)
router.route("/delete-message/:chatId/:messageId").delete(verifyJWT, deleteMessage)



export default router;
