import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    chat:{
        type: String,
        require: true
    }
},{
    timestamps: true
})

export const Chat  = mongoose.model("Chat", chatSchema)