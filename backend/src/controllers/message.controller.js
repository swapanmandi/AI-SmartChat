import { Message } from "../models/message.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const roomMessage = asyncHandler(async (req, res) => {
  const { roomId, message } = req.body;

  const existedMessage = await Message.findOne({ roomId });

  if (existedMessage) {
    existedMessage.messages.push({ senderId: req.user?._id, message });
    await existedMessage.save();
  } else {
    const senderId = req.user?._id;
    const newMessage = await Message.create({
      roomId,
      messages: [{ senderId, message }],
    });

    return res
      .status(200)
      .json(new ApiResponse(200, newMessage, "Message saved successfully"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, existedMessage, "Message added successfully"));
});

const getRoomMessage = asyncHandler(async (req, res) => {
  const { id: roomId } = req.params;

  const roomMessage = await Message.findOne({roomId}).populate("messages.senderId", "fullName");
  if (!roomMessage) {
    throw new ApiError(404, "three is no message");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
      {messages: roomMessage.messages, user: req.user?.fullName},
        "Room Message fetched successfully"
      )
    );
});
export { roomMessage, getRoomMessage };
