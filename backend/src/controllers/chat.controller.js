import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";
import { Chat } from "../models/chat.model.js";
import mongoose from "mongoose";
import { emitSocketEvent } from "../utils/socket.js";
import { User } from "../models/user.model.js";

// const chatGenerate = asyncHandler(async (req, res) => {
//   const { message } = req.body;
//   const { id: receiverId } = req.params;
//   const senderId = req.user?._id;

//   const existedChat = await Chat.findOne({
//     participants: {
//       $all: [senderId, receiverId],
//     },
//   });

//   if (existedChat) {
//     existedChat.chats.push({
//       senderId,
//       receiverId,
//       message,
//     });
//     existedChat.save();
//   } else {
//     const newChat = await Chat.create({
//       participants: [senderId, receiverId],
//       chats: [{ senderId, receiverId, message }],
//     });

//     return res
//     .status(200)
//     .json(new ApiResponse(200, newChat, "Chat saved successfully."));
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, existedChat, "Chat added successfully."));
// });

// const getMessages = asyncHandler(async (req, res) => {
//   const { id: receiverIdId } = req.params;
//   const senderId = req.user?._id
//   const chatSession = await Chat.findOne({participants: [senderId, receiverIdId] }).populate("chats.senderId", "fullName");

//   if (!chatSession) {
//     return res.status(404).json({ error: "Chat session not found" });
//   }

//   res
//     .status(200)
//     .json(
//       new ApiResponse(200, {chats: chatSession.chats, user: req.user?.fullName}, "messagges got successfully")
//     );
// });

// get chat List

// const getChatList = asyncHandler(async (req, res) => {
//   const chatList = await Message.find({}, "sessionId");

//   if (!chatList) {
//     throw new ApiError(400, "there is no chat list");
//   }

//   res.status(200).json(
//     new ApiResponse(
//       200,
//       { list: chatList },

//       "Chat list got successfully!"
//     )
//   );
// });

// // delete chat

// const deleteChat = asyncHandler(async (req, res) => {
//   try {
//     const { id: uuid } = req.params;

//     //console.log("id:", uuid);

//     const result = await Message.deleteOne({ _id: uuid });

//     if (result.deletedCount === 0) {
//       throw new ApiError(400, "cant findchat");
//     }

//     res.status(200).json(new ApiResponse(200, {}, "chat deleted successfully"));
//   } catch (error) {
//     throw new ApiError(500, "error to delete.", error);
//   }
// });

// export { chatGenerate, getMessages, getChatList, deleteChat };

const commonChatAggregation = () => {
  return [
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "participants",
        as: "participants",
        pipeline: [
          {
            $project: {
              password: 0,
              refreshToken: 0,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "messages",
        foreignField: "_id",
        localField: "lastMessage",
        as: "lastMessage",
        pipeline: [
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "sender",
              as: "sender",
              pipeline: [
                {
                  $project: {
                    password: 0,
                    refreshToken: 0,
                  },
                },
              ],
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
    {
      $addFields: {
        lastMessage: {
          $first: "$lastMessage",
        },
      },
    },
  ];
};



const getChatUsers = asyncHandler(async(req, res) =>{

  const users = await User.aggregate([
    {
      $match: {
       _id: {
        $ne : req.user?._id
       }
      }
    },
    {
      $project: {
        fullName: 1,
        email: 1,
      }
    }
  ])

  return res.status(200).json(new ApiResponse(200, users, "Fetched All Chat Users Successfully"))
})




const createOrGetOneOnOneChat = asyncHandler(async(req, res) =>{
  const {id: receiverId} = req.params

  const receiver = await User.findById(receiverId)

  if(!receiver){
    throw new ApiError(404, "Receiver does not exist.")
  }

  if(req.user?._id === receiver){
    throw new ApiError(400, "You cant chat yourself")
  }

const chat = await Chat.aggregate([
  {$match:{
isRoomChat: false,
$and : [
  {
    participants: {
      $elemMatch: {
        $eq: new mongoose.Types.ObjectId(req.user?._id)
      }
    }
  },
  {
    participants: {
      $elemMatch: {
        $eq: new mongoose.Types.ObjectId(receiverId)
      }
    }
  }
]
  }},

  ...commonChatAggregation()

])

if(chat.length){
  return res.status(200).json(new ApiResponse(200, chat[0], "Chat retrived successfully"))
}


const newChatInstanse = await Chat.create({
  participants: [req.user?._id, new mongoose.Types.ObjectId(receiverId)]
})

const newChat = await Chat.aggregate([
  {
    $match: {
      _id: newChatInstanse._id
    }
  },
  ...commonChatAggregation()
])

const payload = newChat[0]

if(!payload){
  throw new ApiError(500, "Internal Server Error")
}


payload?.participants?.forEach(element => {
  if(element._id.toString() === req.user?._id.toString()) return

  emitSocketEvent(req, element._id.toString(), "newChat", payload)
});


return res.status(200).json( new ApiResponse(200, payload, "Chat Retrived Sussessfully"))

})




export {getChatUsers, createOrGetOneOnOneChat}