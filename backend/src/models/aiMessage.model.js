import mongoose from "mongoose";

const aiMessageSchema = new mongoose.Schema(
  {
    aiChat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AiChat",
      required: true,
    },
    sender: {
      role: {
        type: String,
        enum: ["user", "model"],
        required: true,
      },
      user: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: "User" 
        },
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const AiMessage = mongoose.model("AiMessage", aiMessageSchema);
