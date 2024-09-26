import { AiChat } from "../models/aiChat.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AiMessage } from "../models/aiMessage.model.js";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const createAiChat = asyncHandler(async (req, res) => {
  try {
    const { id: aiChatId } = req.params;
    const {query } = req.body;

    if (query === "") {
      throw new ApiError(400, "The field is empty");
    }

    const chatHistory = await AiMessage.findOne({ aiChat: aiChatId });

    const chat = model.startChat({
      history:
        chatHistory?.map((item) => ({
          role: item.sender?.role ? "user" : "model",
          parts: [{ text: item.query }],
        })) || [],
    });
    let result = await chat.sendMessage(query);
    console.log(result.response.text());
    //result = await chat.sendMessage("How many paws are in my house?");
    const text = result.response.text();

    let existedAiChat = await AiChat.findOne({ _id: aiChatId });
    console.log("existed chat", existedAiChat);

    //const sender = req.user?._id;

    //if (existedAiChat) {
      // existedAiChat.messages.push({ sender, query });
      // existedAiChat.messages.push({ sender: null, query: text });
      // await existedAiChat.save();
    //   await AiMessage.create({})
    // } else {
    //   existedAiChat = await AiChat.create({
    //     aiChatId,
    //     messages: [
    //       { sender, query },
    //       { sender: null, query: text },
    //     ],
    //   });
    // }

    if(!existedAiChat){
      throw new ApiError(404, "Chat does not exis")
    }

    await AiMessage.create({aiChat: aiChatId, sender:{role: "user", user: req.user?._id}, content: query})
    await AiMessage.create({aiChat: aiChatId, sender:{role: "model", user: null}, content: text})
    
    return res
      .status(200)
      .json(new ApiResponse(200, {text}, "ai chat send successfully"));
  } catch (error) {
    throw new ApiError(404, "There is an error while create ai chat", error);
  }
});

const getAiRoomChat = asyncHandler(async (req, res) => {
  const { id: aiChatId } = req.params;

  const chats = await AiChat.findOne({ aiChatId }).populate('messages.sender', 'fullName');

  if (!chats) {
    throw new ApiError(404, "No Chats");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {chats: chats.messages, user: req.user?.fullName},
        "Ai Room Chats fetched Successfully."
      )
    );
});

export { createAiChat, getAiRoomChat };
