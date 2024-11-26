import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(

  {
  //   participants: {
  //     type: [mongoose.Schema.Types.ObjectId],
  //     ref: "User",
  //   },
  //   chats: [
  //     {
  //       senderId: {
  //         type: mongoose.Schema.Types.ObjectId,
  //         ref: "User",
  //         required: true,
  //       },
  //       receiverId: {
  //         type: mongoose.Schema.Types.ObjectId,
  //         ref: "User",
  //         required: true,
  //       },
  //       message: {
  //         type: String,
  //         required: true,
  //       },
  //     },
  //   ],


name: {
  type: String,
  required: function(){
    return this.isRoomChat
  }

},
isRoomChat:{
  type:Boolean,
  default : false

},
participants:{
  type: [mongoose.Schema.Types.ObjectId],
  ref: "User"
}
,
lastMessage: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Message"
},
admin:{
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: function(){
    return this.isRoomChat
  }
}
   },
  {
    timestamps: true,
  }
);

export const Chat = mongoose.model("Chat", chatSchema);
