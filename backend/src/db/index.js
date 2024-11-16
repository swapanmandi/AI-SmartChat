import mongoose from "mongoose";
import {DB_NAME} from "../constant.js"

const connectDB = async function(){
    try {
        const connectionInstanse = mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Database Connected Successfully!`)
    } catch (error) {
        console.log("Database Connection Error!", error)
        process.exit(1)
    }
}

export default connectDB