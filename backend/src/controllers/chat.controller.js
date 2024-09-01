import { GoogleGenerativeAI } from "@google/generative-ai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";
import { Chat } from "../models/chat.model.js";

// const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const chatGenerate = asyncHandler(async (req, res) => {
//   try {
//     const { sessionId, message } = req.body;

//     let chatSession = await Message.findOne({ sessionId });

//     if (!chatSession) {
//       chatSession = new Message({ sessionId, messages: [] });
//     }

//     const chat = model.startChat({
//       history: chatSession.messages.map((msg) => ({
//         role: msg.sender === "user" ? "user" : "model",
//         parts: [{ text: msg.message }],
//       })),
//       generationConfig: {
//         maxOutputTokens: 100,
//       },
//     });

//     const result = await chat.sendMessage(message);
//     const response = await result.response;
//     const text = response.text();

//     chatSession.messages.push({ sender: "user", message });
//     chatSession.messages.push({ sender: "model", message: text });

//     await chatSession.save();

//     res
//       .status(200)
//       .json(
//         new ApiResponse(200, { response: text }, "Chat saved successfully!")
//       );
//   } catch (error) {
//     throw new ApiError(500, "error to save chat");
//   }
// });

// endpoint to fetch chat history

// const apiKey = process.env.GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 64,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

// Generating chat
// const chatGenerate = asyncHandler(async (req, res) => {
//   try {
//     const { sessionId, message } = req.body;

//     let chatSession = await Message.findOne({ sessionId });

//     if (!chatSession) {
//       chatSession = new Message({ sessionId, messages: [] });
//     }

//     const chat = model.startChat({
//       history: chatSession.messages.map((msg) => ({
//         role: msg.sender === "user" ? "user" : "model",
//         parts: [{ text: msg.message }],
//       })),
//       generationConfig,
//     });

//     const result = await chat.sendMessage(message);
//     const text = result.response.text();

//     chatSession.messages.push({ sender: "user", message });
//     chatSession.messages.push({ sender: "model", message: text });

//     await chatSession.save();

//     res.status(200).json(
//       new ApiResponse(200, { response: text }, "Chat saved successfully!")
//     );
//   } catch (error) {
//     throw new ApiError(500, "Error saving chat");
//   }
// });

const chatGenerate = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user?._id;

  const existedChat = await Chat.findOne({
    participants: {
      $all: [senderId, receiverId],
    },
  });

  if (existedChat) {
    existedChat.chats.push({
      senderId,
      receiverId,
      message,
    });
    existedChat.save();
  } else {
    const newChat = await Chat.create({
      participants: [senderId, receiverId],
      chats: [{ senderId, receiverId, message }],
    });

    return res
    .status(200)
    .json(new ApiResponse(200, newChat, "Chat saved successfully."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, existedChat, "Chat added successfully."));
});

const getMessages = asyncHandler(async (req, res) => {
  const { id: receiverIdId } = req.params;
  const senderId = req.user?._id
  const chatSession = await Chat.findOne({participants: [senderId, receiverIdId] }).populate("chats.senderId", "fullName");

  if (!chatSession) {
    return res.status(404).json({ error: "Chat session not found" });
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, {chats: chatSession.chats, user: req.user?.fullName}, "messagges got successfully")
    );
});

// get chat List

const getChatList = asyncHandler(async (req, res) => {
  const chatList = await Message.find({}, "sessionId");

  if (!chatList) {
    throw new ApiError(400, "there is no chat list");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      { list: chatList },

      "Chat list got successfully!"
    )
  );
});

// delete chat

const deleteChat = asyncHandler(async (req, res) => {
  try {
    const { id: uuid } = req.params;

    //console.log("id:", uuid);

    const result = await Message.deleteOne({ _id: uuid });

    if (result.deletedCount === 0) {
      throw new ApiError(400, "cant findchat");
    }

    res.status(200).json(new ApiResponse(200, {}, "chat deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "error to delete.", error);
  }
});

export { chatGenerate, getMessages, getChatList, deleteChat };
