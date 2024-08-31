import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    admin:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: "User"
    },
    participants:{
        type:[mongoose.Schema.Types.ObjectId],
        ref: "User"
    }
},{timestamps: true})


export const Room = mongoose.model("Room", roomSchema)