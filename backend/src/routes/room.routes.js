import {createRoom} from '../controllers/room.controller.js'
import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = new Router()


router.route("/create-room").post(verifyJWT, createRoom)







export default router