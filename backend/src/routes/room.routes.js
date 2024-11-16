import {
  createRoom,
  getRooms,
  getRoomUsers,
} from "../controllers/room.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = new Router();

router.route("/create-room").post(verifyJWT, createRoom);
router.route("/users/:id").get(verifyJWT, getRoomUsers);
router.route("/rooms").get(verifyJWT, getRooms);

export default router;
