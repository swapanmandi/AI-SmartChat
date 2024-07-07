// import mongoose from "mongoose";

// const messageModel = new mongoose.Schema({
//     participants:[{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     }],
//     messages:[{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Chat"
//     }]
// })

// export const Message = mongoose.model("Message", messageModel)

import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
    sessionId:{
        type: String,
        required: true
    },
    messages:[{
        sender:{
            type: String,
            required: true
        },
        message:{
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
})

export const Message = mongoose.model("Message", messageModel)