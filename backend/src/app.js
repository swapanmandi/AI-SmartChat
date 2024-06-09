import express, { urlencoded } from 'express'
import cors from 'cors'
import chatRouter from './routes/chat.route.js'

const app = express();
app.use(express.json())
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({
    extended:true,
    limit: '16kb'
}))


//route ddeclaration
app.use('/api/v1', chatRouter)

export {app}