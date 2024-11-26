import {
  sendMessage,
  getMessages,
  deleteMessage,
} from "../controllers/message.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = new Router();

router
  .route("/create-message/:id")
  .post(
    upload.fields([{ name: "image", maxCount: 1 }]),
    verifyJWT,
    sendMessage
  );
router.route("/get-messages/:id").get(verifyJWT, getMessages);
router
  .route("/delete-message/:chatId/:messageId")
  .delete(verifyJWT, deleteMessage);

export default router;
