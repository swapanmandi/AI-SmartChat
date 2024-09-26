import mongoose from "mongoose";

const aiChatSchema = new mongoose.Schema(
  {
    chat:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat"
    },
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);


export const AiChat = mongoose.model("AiChat", aiChatSchema)