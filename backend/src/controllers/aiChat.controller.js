import { AiChat } from "../models/aiChat.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createAiChat = asyncHandler(async (req, res) => {
  try {
    const { id: chatId } = req.params;
    const {participants} = req.body

    const existedAiChat = await AiChat.findOne({ chat: chatId });
    let aiChat;

    if (!existedAiChat) {
      aiChat = await AiChat.create({ chat: chatId, participants });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, aiChat, "Ai Chat created successfully"));
  } catch (error) {
    throw new ApiError(500, "Error to create ai chat- internal server error");
  }
});

export { createAiChat };
