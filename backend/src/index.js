import dotenv from 'dotenv'
import {app} from './app.js'
import { connectDB } from './db/index.js';

dotenv.config({
    path: './.env'
})

connectDB()

app.listen(8000 || process.env.PORT, ()=>{
    console.log(`Server is running on PORT: ${8000 || process.env.PORT}`)
});