import mongoose from "mongoose";

const aiRoomChatSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        message: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);


export const AiRoom = mongoose.model("AiRoom", aiRoomChatSchema)