import { AiChat } from "../models/aiChat.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AiMessage } from "../models/aiMessage.model.js";

import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";

const commonAiMessageAggregation = () => {
  return [
    {
      $lookup: {
        from: "aichats",
        foreignField: "_id",
        localField: "aiChat",
        as: "aiChat",
        pipeline: [
          {
            $project: {
              chat: 1,
              participants: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        aiChat: {
          $first: "$aiChat",
        },
      },
    },
  ];
};

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const createAiChat = asyncHandler(async (req, res) => {
  
    const { id: aiChatId } = req.params;
    const { query } = req.body;
    //console.log("query:", query)

    if (query === "") {
      throw new ApiError(400, "The query field is empty!");
    }

    let existedAiChat = await AiChat.findById(aiChatId);
    console.log("existed chat", existedAiChat);

    if (!existedAiChat) {
      throw new ApiError(404, "Chat does not exis");
    }


    if(!existedAiChat.participants.includes(req.user?._id)){
      throw new ApiError(409, "You are not in this chat")
    }

   //await AiMessage.findOne({ aiChat: aiChatId });
   const chatHistory = await AiMessage.aggregate([
      {
        $match: {
          aiChat: new mongoose.Types.ObjectId(aiChatId),
        },
      },
      ...commonAiMessageAggregation(),
    ]);
    //console.log("CHAT HISTORY:", chatHistory)

    const chat = model.startChat({
      history:
        chatHistory?.map((item) => ({
          role: item.sender?.role ? "user" : "model",
          parts: [{ text: item.content }],
        })) || [],
    });
    let result = await chat.sendMessage(query);
    //console.log(result.response.text());
    //result = await chat.sendMessage("How many paws are in my house?");
    const text = result.response.text();

   
    await AiMessage.create({
      aiChat: aiChatId,
      sender: { role: "user", user: req.user?._id },
      content: query,
    });
    await AiMessage.create({
      aiChat: aiChatId,
      sender: { role: "model", user: null },
      content: text,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { text }, "ai chat send successfully"));
 
});

// GET AI CHAT MESSAGES
const getAiMessages = asyncHandler(async (req, res) => {
  const { id: aiChatId } = req.params;

  const aiChat = await AiChat.findById(aiChatId);

  if (!aiChat) {
    throw new ApiError(404, "Chat does not exist");
  }

  const messages = await AiMessage.aggregate([
    {
      $match: {
        aiChat: new mongoose.Types.ObjectId(aiChatId),
      },
    },
    ...commonAiMessageAggregation(),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
       messages,
        "Ai Chats fetched Successfully."
      )
    );
});

export { createAiChat, getAiMessages };



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
