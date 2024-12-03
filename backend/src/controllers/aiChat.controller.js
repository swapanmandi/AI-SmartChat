import { AiChat } from "../models/aiChat.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {Chat} from "../models/chat.model.js"

const createAiChat = asyncHandler(async (req, res) => {
  try {
    const { id: chatId } = req.params;
   
    const chat = await Chat.findById(chatId)
   
    if(!chat){
      throw new ApiError(404, "Chat does not exist")
    }

    if(!chat.isRoomChat){
      throw new ApiError(400, "It is not a room chat")
    }


    if(!chat.participants?.includes(req.user?._id)){
      throw new ApiError(409, "You are not in this chat")
    }

    let existedAiChat = await AiChat.findOne({ chat: chatId });

    if (!existedAiChat) {
      existedAiChat = await AiChat.create({ chat: chatId, participants: chat.participants });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, existedAiChat, "Ai Chat created successfully"));
  } catch (error) {
    throw new ApiError(500, "Error to create ai chat- internal server error");
  }
});

export { createAiChat };
