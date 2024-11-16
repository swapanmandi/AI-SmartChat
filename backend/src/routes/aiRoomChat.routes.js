import { Router } from "express"
import {createAiMessage} from "../controllers/aiRoomChat.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"




const router = new Router()


router.route("/create-ai-room-chat/:id").post(verifyJWT, createAiMessage)

export default router