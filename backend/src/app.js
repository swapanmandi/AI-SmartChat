import express from 'express'
import cors from 'cors'
import chatRouter from './routes/chat.route.js'
import signupRouter from './routes/signupRoute.js'


const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({
    extended:true,
    limit: '16kb'
}))

// app.use((req, res, next) =>{
//     console.log('Request Method:', req.method);
//     console.log('Request Headers:', req.headers);
//     console.log('Request Body:', req.body);
//     next();
// })


//route ddeclaration
app.use('/', chatRouter)
app.use('/app/user/', signupRouter)

export {app}