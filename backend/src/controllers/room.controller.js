import { Room } from "../models/room.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createRoom = asyncHandler(async (req, res) => {
  const { roomName, users } = req.body;

  console.log("getting data", req.body);

  const room = await Room.create({
    name: roomName,
    admin: [req.user?.id],
    participants: users,
  });

  if (!room) {
    throw new ApiError(400, "error to create room");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, room, "room created successfully"));
});

const getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find();
  if (!rooms) {
    throw new ApiError(400, "There is no participant");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, rooms, "room users fetched successfully"));
});

const getRoomUsers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const users = await Room.findById(id).populate("participants", "fullName");
  if (!users) {
    throw new ApiError(401, "there is no users");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        users.participants,
        "room users fetched successfully"
      )
    );
});

export { createRoom, getRooms, getRoomUsers };
