import { sendMessage } from "../controllers/message.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = new Router();

router.route("/create-message/:id").post(verifyJWT, sendMessage);
//router.route("/get-message/:id").get(verifyJWT, getRoomMessage)




export default router;
