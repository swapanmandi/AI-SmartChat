import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
    participants:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    messages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }]
})

export const Message = mongoose.model("Message", messageModel)