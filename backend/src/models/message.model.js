import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
  messages: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
   
      message: {
        type: String,
        required: true,
      },
    },
  ],
}, {timestamps: true});

export const Message = mongoose.model("Message", messageModel);
