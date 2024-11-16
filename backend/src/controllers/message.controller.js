import { Message } from "../models/message.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chat.model.js";
import mongoose from "mongoose";
import { emitSocketEvent } from "../utils/socket.js";

// const roomMessage = asyncHandler(async (req, res) => {
//   const { roomId, message } = req.body;

//   const existedMessage = await Message.findOne({ roomId });

//   if (existedMessage) {
//     existedMessage.messages.push({ senderId: req.user?._id, message });
//     await existedMessage.save();
//   } else {
//     const senderId = req.user?._id;
//     const newMessage = await Message.create({
//       roomId,
//       messages: [{ senderId, message }],
//     });

//     return res
//       .status(200)
//       .json(new ApiResponse(200, newMessage, "Message saved successfully"));
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, existedMessage, "Message added successfully"));
// });

// const getRoomMessage = asyncHandler(async (req, res) => {
//   const { id: roomId } = req.params;

//   const roomMessage = await Message.findOne({roomId}).populate("messages.senderId", "fullName");
//   if (!roomMessage) {
//     throw new ApiError(404, "three is no message");
//   }

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//       {messages: roomMessage.messages, user: req.user?.fullName},
//         "Room Message fetched successfully"
//       )
//     );
// });
// export { roomMessage, getRoomMessage };

const messageCommonAggregation = () => {
  return [
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "sender",
        as: "sender",
        pipeline: [
          {
            $project: {
              fullName: 1,
              email: 1,
            },
          },
          
        ],
      },
    },
    {
      $addFields: {
        sender: {
          $first: "$sender",
        },
      },
    },
  ];
};


//send messages

const sendMessage = asyncHandler(async (req, res) => {
  const { id: chatId } = req.params;
  console.log("chatid", chatId);
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Message Field is Required");
  }

  const selectedChat = await Chat.findById(chatId);
  if (!selectedChat) {
    throw new ApiError(404, "Chat does not exist.");
  }

  console.log("userid", req.user?._id.toString());
  const message = await Message.create({
    sender: req.user?._id,
    content: content || "",
    chat: chatId,
  });

  const chat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $set: {
        lastMessage: message._id,
      },
    },
    {
      new: true,
    }
  );

  const messages = await Message.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(message._id),
      },
    },
    ...messageCommonAggregation(),
  ]);

  const receivedMessage = messages[0];

  if (!receivedMessage) {
    throw new ApiError(500, "Error to get message or internal server error");
  }

  chat.participants.forEach((item) => {
    //if (item.toString() === req.user?._id.toString()) return;

    emitSocketEvent(req, item.toString(), "messageReceived", receivedMessage);
  });

  return res
    .status(201)
    .json(new ApiResponse(200, receivedMessage, "Message saved successfully"));
});


//get messages

const getMessages = asyncHandler(async (req, res) => {
  const { id: chatId } = req.params;

  const selectedChat = await Chat.findById(chatId);
  if (!selectedChat) {
    throw new ApiError(404, "Chat does not exist");
  }

  if (!(selectedChat.participants?.includes(req.user?._id))) {
    throw new ApiError(400, "You are not a part of this chat");
  }

  const messages = await Message.aggregate([
    {
      $match: {
        chat: new mongoose.Types.ObjectId(chatId),
      },
    },
    ...messageCommonAggregation(),
    {
      $sort: {
        createdAt: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "All Messages Fetched Successfully"));
});


// delete messages

const deleteMessage = asyncHandler(async(req, res) =>{
  const {chatId, messageId} = req.params

  const chat = await Chat.findOne({
    _id: chatId,
    participants: req.user?._id
  })

  if(!chat){
    throw new ApiError(404, "Chat does not exist")
  }

  const message = await Message.findOne({
    _id: messageId
  })

  if(!message){
    throw new ApiError(404, "Message does not exist")
  }

 
  if(message.sender.toString() !== req.user?._id.toString()){
throw new ApiError(403, "You are not a sender")
  }

  await Message.deleteOne({
    _id: messageId
  })

chat.participants.forEach(item => {
  emitSocketEvent(req, item.toString(), "messageDelete", message)
})

return res.status(200).json(new ApiResponse(200, message, "Message Delete Successfully"))
})

export { sendMessage, getMessages, deleteMessage };
