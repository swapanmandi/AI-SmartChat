import { Router } from "express";
import {
  getChatUsers,
  createOrGetOneOnOneChat,
  createRoomChat,
  getAllChats,
  getRoomChatDetails,
  renameRoomName,
  addParticipantToRoomChat,
  removeParticipantFromRoomChat,
  deleteRoomChat,
  deleteOneOnOneChat,

} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// router.route("/generateChat/:id").post(chatGenerate)
// router.route("/chatHistory/:id").get(getMessages)
// router.route("/chatList").get(getChatList)
// router.route("/deleteChat/:id").delete(deleteChat)

router.route("/chat-users").get(verifyJWT, getChatUsers);
router.route("/oneononechat/:id").post(verifyJWT, createOrGetOneOnOneChat);
router.route("/create-roomchat").post(verifyJWT, createRoomChat);
router.route("/chats").get(verifyJWT, getAllChats);
router.route("/room-info/:id").get(verifyJWT, getRoomChatDetails)
router.route("/rename-room/:id").patch(verifyJWT, renameRoomName)
router.route("/add-participant").patch(verifyJWT, addParticipantToRoomChat)
router.route("/remove-participant").patch(verifyJWT, removeParticipantFromRoomChat)
router.route("/delete-room/:id").delete(verifyJWT, deleteRoomChat)
router.route("/delete-chat/:id").delete(verifyJWT, deleteOneOnOneChat)




export default router;
