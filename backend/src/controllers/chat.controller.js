import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chat.model.js";
import { emitSocketEvent } from "../utils/socket.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

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

// get users
const getChatUsers = asyncHandler(async (req, res) => {
  const users = await User.aggregate([
    {
      $match: {
        _id: {
          $ne: req.user?._id,
        },
      },
    },
    {
      $project: {
        fullName: 1,
        email: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Fetched All Chat Users Successfully"));
});

// create and get single chat
const createOrGetOneOnOneChat = asyncHandler(async (req, res) => {
  const { id: receiverId } = req.params;

  const receiver = await User.findById(receiverId);

  if (!receiver) {
    throw new ApiError(404, "Receiver does not exist.");
  }

  if (req.user?._id === receiver) {
    throw new ApiError(400, "You cant chat yourself");
  }

  const chat = await Chat.aggregate([
    {
      $match: {
        isRoomChat: false,
        $and: [
          {
            participants: {
              $elemMatch: {
                $eq: new mongoose.Types.ObjectId(req.user?._id),
              },
            },
          },
          {
            participants: {
              $elemMatch: {
                $eq: new mongoose.Types.ObjectId(receiverId),
              },
            },
          },
        ],
      },
    },

    ...commonChatAggregation(),
  ]);

  if (chat.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, chat[0], "Chat retrived successfully"));
  }

  const newChatInstanse = await Chat.create({
    participants: [req.user?._id, new mongoose.Types.ObjectId(receiverId)],
  });

  const newChat = await Chat.aggregate([
    {
      $match: {
        _id: newChatInstanse._id,
      },
    },
    ...commonChatAggregation(),
  ]);

  const payload = newChat[0];

  if (!payload) {
    throw new ApiError(500, "Internal Server Error");
  }

  payload?.participants?.forEach((element) => {
    if (element._id.toString() === req.user?._id.toString()) return;

    emitSocketEvent(req, element._id.toString(), "newChat", payload);
  });

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Chat Created Sussessfully"));
});

//create Room Chat

const createRoomChat = asyncHandler(async (req, res) => {
  const { name, participants } = req.body;
  if (!name) {
    throw new ApiError(400, "Room Name is Required");
  }

  if (participants.includes(req.user?._id)) {
    throw new ApiError(400, "You are add yourself, You will be the admin");
  }

  const members = [...new Set([...participants, req.user?._id.toString()])];

  if (members.length < 2) {
    throw new ApiError(400, "You must add atleast 1 friend");
  }

  const roomIconLocalPath = req.files.roomIcon[0].path;
  console.log(roomIconLocalPath);

  const roomChat = await Chat.create({
    name,
    isRoomChat: true,
    participants: members,
    admin: req.user?._id,
  });

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: roomChat._id,
      },
    },
    ...commonChatAggregation(),
  ]);

  const payload = chat[0];

  if (!payload) {
    throw new ApiError(500, "Internal server error");
  }

  payload.participants.forEach((item) => {
    if (item._id.toString() === req.user?._id.toString()) return;

    emitSocketEvent(req, item._id, "newChat", payload);
  });

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Room Created successfully"));
});

// get all chats
const getAllChats = asyncHandler(async (req, res) => {
  const chats = await Chat.aggregate([
    {
      $match: {
        participants: {
          $elemMatch: {
            $eq: req.user?._id,
          },
        },
      },
    },
    ...commonChatAggregation(),
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, chats, "All Chats fetched successfully"));
});

//get rommChat details

const getRoomChatDetails = asyncHandler(async (req, res) => {
  const { id: chatId } = req.params;

  const roomChat = await Chat.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(chatId),
        isRoomChat: true,
      },
    },
    ...commonChatAggregation(),
  ]);

  const chat = roomChat[0];
  if (!chat) {
    throw new ApiError(404, "Rom Chat does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, chat, "Room Chat Details fetched successfully"));
});

// rename room name

const renameRoomName = asyncHandler(async (req, res) => {
  const { id: chatId } = req.params;
  const { name } = req.body;

  const roomChat = await Chat.findOne({
    _id: chatId,
    isRoomChat: true,
  });

  if (!roomChat) {
    throw new ApiError(404, "Room Chat does not exist");
  }

  if (roomChat.admin?.toString() !== req.user?._id.toString()) {
    throw new ApiError(404, "You are not a admin");
  }

  const renamedRoomName = await Chat.findByIdAndUpdate(
    chatId,
    {
      $set: {
        name,
      },
    },
    { new: true }
  );
  const chat = await Chat.aggregate([
    {
      $match: {
        _id: renamedRoomName._id,
      },
    },
    ...commonChatAggregation(),
  ]);

  const payload = chat[0];

  if (!payload) {
    throw new ApiError(500, "Error to rename room name- internal server error");
  }

  payload?.participants.forEach((user) => {
    emitSocketEvent(req, user._id.toString(), "renamedRoomName", payload);
  });
  return res
    .status(200)
    .json(new ApiResponse(200, payload, "Room Chat Name Changed Successfully"));
});

//add participant

const addParticipantToRoomChat = asyncHandler(async (req, res) => {
  const { chatId, participantId } = req.body;
  console.log(req.body);

  const roomChat = await Chat.findOne({ _id: chatId, isRoomChat: true });
  if (!roomChat) {
    throw new ApiError(404, "Room Chat does not exist");
  }

  if (roomChat.admin?.toString() !== req.user?._id.toString()) {
    throw new ApiError(400, "You are not a admin");
  }

  const existedParticipants = roomChat.participants;

  if (existedParticipants.includes(participantId)) {
    throw new ApiError(409, "User is already in room");
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: {
        participants: participantId,
      },
    },
    {
      new: true,
    }
  );

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: updatedChat._id,
      },
    },
    ...commonChatAggregation(),
  ]);

  const payload = chat[0];

  if (!payload) {
    throw new ApiError(500, "Error to add user to room- internal server error");
  }

  emitSocketEvent(req, participantId, "newChat", payload);

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "User add to room successfully."));
});

//remove participant fron room

const removeParticipantFromRoomChat = asyncHandler(async (req, res) => {
  const { chatId, participantId } = req.body;

  const roomChat = await Chat.findOne({ _id: chatId, isRoomChat: true });

  if (!roomChat) {
    throw new ApiError(404, "Room Chat does not exist");
  }

  if (roomChat?.admin.toString() !== req.user?._id.toString()) {
    throw new ApiError(409, "You are not a admin");
  }

  const existedChat = roomChat.participants;

  if (!existedChat.includes(participantId)) {
    throw new ApiError(404, "User does not exist in room");
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: {
        participants: participantId,
      },
    },
    {
      new: true,
    }
  );

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: updatedChat?._id,
      },
    },
    ...commonChatAggregation(),
  ]);

  const payload = chat[0];

  if (!payload) {
    throw new ApiError(500, "error to remove - internal server error");
  }

  emitSocketEvent(req, participantId, "leaveChat", payload);

  return res
    .status(200)
    .json(new ApiResponse(200, payload, "User removed successfully"));
});

//delete room
const deleteRoomChat = asyncHandler(async (req, res) => {
  const { id: chatId } = req.params;

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(chatId),
        isRoomChat: true,
      },
    },
    ...commonChatAggregation(),
  ]);

  const payload = chat[0];

  if (!payload) {
    throw new ApiError(404, "The Room does not exist.");
  }

  if (payload.admin?.toString() !== req.user?._id.toString()) {
    throw new ApiError(409, "You are not a admin");
  }

  await Chat.findByIdAndDelete(chatId);

  payload?.participants.forEach((item) => {
    if (item._id.toString() === req.user?._id.toString()) return;

    emitSocketEvent(req, item._id, "leaveChat", payload);
  });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Room deleted successfully"));
});

const deleteOneOnOneChat = asyncHandler(async (req, res) => {
  const { id: chatId } = req.params;

  const chat = await Chat.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(chatId),
      },
    },
    ...commonChatAggregation(),
  ]);

  const payload = chat[0];

  if (!payload) {
    throw new ApiError(404, "Chat does not exist");
  }

  await Chat.findByIdAndDelete(chatId);

  const otherParticipants = payload.participants?.find(
    (item) => item._id.toString() !== req.user?._id.toString()
  );

  emitSocketEvent(req, otherParticipants._id, "leaveChat", payload);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Chat deleted successfully"));
});

// change room icon
const changeRoomIcon = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const roomIconLocalPath = req.files?.roomIcon[0].path;

  if (!roomIconLocalPath) {
    throw new ApiError(400, "File is missing");
  }

  const uploadedRoomIcon = await uploadOnCloudinary(roomIconLocalPath);

  if (!uploadedRoomIcon) {
    throw new ApiError(400, "Error to upload on cloudinary");
  }

  const roomChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $set: { roomIcon: uploadedRoomIcon.url || "" },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, roomChat, "RoomIcon updated successfully"));
});

export {
  getChatUsers,
  getAllChats,
  createOrGetOneOnOneChat,
  deleteOneOnOneChat,
  changeRoomIcon,
  createRoomChat,
  getRoomChatDetails,
  renameRoomName,
  addParticipantToRoomChat,
  removeParticipantFromRoomChat,
  deleteRoomChat,
};
