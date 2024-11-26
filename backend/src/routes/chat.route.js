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
  changeRoomIcon,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/chat-users").get(getChatUsers);
router.route("/oneononechat/:id").post(createOrGetOneOnOneChat);
router.route("/create-roomchat").post(createRoomChat);
router.route("/all-chats").get(getAllChats);
router.route("/room-info/:id").get(getRoomChatDetails);
router.route("/rename-room/:id").patch(renameRoomName);
router.route("/add-participant").patch(addParticipantToRoomChat);
router.route("/remove-participant").patch(removeParticipantFromRoomChat);
router.route("/delete-room/:id").delete(deleteRoomChat);
router.route("/delete-chat/:id").delete(deleteOneOnOneChat);
router
  .route("/change-room-icon/:chatId")
  .patch(upload.fields([{ name: "roomIcon", maxCount: 1 }]), changeRoomIcon);

export default router;
