import { GoogleGenerativeAI } from "@google/generative-ai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import mongoose from "mongoose";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const chatGenerate = asyncHandler(async (req, res) => {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const code = req.body;
    //console.log('data', code)
    //console.log('running chat api', process.env.API_KEY)
    const prompt = code.receivedObj.data;

    //console.log("received prompt:", code.receivedObj.data);

    const result = await model.generateContent(prompt);

    const response = result.response;
    const text = response.text();

    res.status(200).json({ chat: text });
  } catch (error) {
    throw new ApiError(500, "Error While Generating Promot.");
    //console.error("Error while generationg prompt chat.", error.message);
    //res.status(500).json({ error: "Internal Server Error" });
  }
});

const chat = asyncHandler(async (req, res) => {
  try {
    const { chat } = req.body;
    const senderId = req.user._id;
    const { id: receiverId } = req.params;

    const newChat = new Chat({ senderId, receiverId, chat });

    let existMssage = await Message.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!existMssage) {
      existMssage = new Message({
        participants: [senderId, receiverId],
        messages: [newChat._id],
      });
    } else {
      existMssage.messages.push(newChat._id);
    }

    await Promise.all([newChat.save(), existMssage.save()]);

    return res
      .status(200)
      .json(new ApiResponse(200, newChat, "Chat Saved succcessfully."));
  } catch (error) {
    throw new ApiError(500, "Error to save chat");
  }
});

//get message between to uses

const getMessages = asyncHandler(async (req, res) => {
 try {
   const  senderId  = req.user._id;
   const { id: receiverId } = req.params;

  //  if(!senderId){
  //   throw new ApiError(400, "The ids are not found.")
  //  }

  console.log(senderId, receiverId)
   const foundMessages = await Message.findOne({
     participants: { $all: [senderId, receiverId] }
   }).populate("messages");
 
   if(!foundMessages){
     return res
     .status(404)
     .json(
       new ApiResponse(404, [], "No Messages Found!")
     )
   }
 
   return res.status(200)
   .json(new ApiResponse(200, foundMessages, "Messages got Successful!"))
 
 } catch (error) {
  throw new ApiError(500, "Error to get messages.")
 }
  
});

// const deleteChat = asyncHandler(async(req, res) =>{

//   await Chat.findByIdAndDelete(req._id)

//   return res.status(200)
//   .json(
//     new ApiResponse(200,
//       {},
//       "Chat deleted Successfully."
//     )
//   )
// })

// const getChat = asyncHandler(async(req, res) =>{
//   return res.status(200)
//   .json(
//     new ApiResponse(200,req.chatHistory,
//       "Chat find successfully."
//     )
//   )
// })

export { chatGenerate, chat, getMessages };
