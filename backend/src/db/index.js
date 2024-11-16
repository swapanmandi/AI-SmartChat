import mongoose from 'mongoose'
import {DB_NAME} from '../constant.js'

const connectDB = async () =>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log('MongoDB Connected!')
    } catch (error) {
        console.error('MongoDB Connection Error.', error);
        process.exit(1);
    }
}

export {connectDB}