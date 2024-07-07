import { GoogleGenerativeAI } from "@google/generative-ai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//generating chat

const chatGenerate = asyncHandler(async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    let chatSession = await Message.findOne({ sessionId });

    if (!chatSession) {
      chatSession = new Message({ sessionId, messages: [] });
    }

    const chat = model.startChat({
      history: chatSession.messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.message }],
      })),
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    chatSession.messages.push({ sender: "user", message });
    chatSession.messages.push({ sender: "model", message: text });

    await chatSession.save();

    res
      .status(200)
      .json(
        new ApiResponse(200, { response: text }, "Chat saved successfully!")
      );
  } catch (error) {
    throw new ApiError(500, "error to save chat");
  }
});

// endpoint to fetch chat history

const getMessages = asyncHandler(async (req, res) => {
  const { sessionId: sessionId } = req.params;
  const chatSession = await Message.findOne({ sessionId });

  if (!chatSession) {
    return res.status(404).json({ error: "Chat session not found" });
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, chatSession.messages, "messagges got successfully")
    );
});

// get chat List

const getChatList = asyncHandler(async (req, res) => {

 
  const chatList = await Message.find({}, 'sessionId')

  if (!chatList) {
    throw new ApiError(400, "there is chat list");
  }

  res
  .status(200)
  .json(
      new ApiResponse(
        200,
        { list: chatList },

        "Chat list got successfully!"
      )
    )
  
});

export { chatGenerate, getMessages, getChatList };
