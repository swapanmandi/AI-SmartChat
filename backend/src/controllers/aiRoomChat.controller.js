import { AiRoom } from "../models/aiRoomChat.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";

import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const createAiMessage = asyncHandler(async (req, res) => {
  try {
    const { id: roomId } = req.params;
    const { message } = req.body;
    const chatHistory = await Message.findOne({ roomId });

    const chat = model.startChat({
      history:
        chatHistory?.messages?.map((item) => ({
          role: item.senderId ? "user" : "model",
          parts: [{ text: item.message }],
        })) || [],
    });
    let result = await chat.sendMessage(message);
    console.log(result.response.text());
    //result = await chat.sendMessage("How many paws are in my house?");
    const text = result.response.text();

    let existedAiChat = await AiRoom.findOne({ roomId });
    console.log("existed chat", existedAiChat);

    const sender = req.user?._id;

    if (existedAiChat) {
      existedAiChat.messages.push({ sender, message });
      existedAiChat.messages.push({sender: null, message: text})
      await existedAiChat.save();
    } else {
      existedAiChat = await AiRoom.create({
        roomId,
        messages: [{ sender, message }, {sender: null, message: text}],
      });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, text, "ai chat send successfully"));
  } catch (error) {
    throw new ApiError(404, "There is an error while create ai chat", error);
  }
});

export { createAiMessage };
