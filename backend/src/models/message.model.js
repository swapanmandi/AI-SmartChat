import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
  // roomId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Room",
  // },
  // messages: [
  //   {
  //     senderId: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "User",
  //       required: true,
  //     },
   
  //     message: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  // ],


  sender:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  content: {
    type: String,
    required: true
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat"
  },
  attachments: {
    type: [{
      url: String,
      localPath: String
    }],
    default : []
  }

}, {timestamps: true});

export const Message = mongoose.model("Message", messageModel);
