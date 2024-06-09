import dotenv from 'dotenv'
import {app} from './app.js'

dotenv.config({
    path: './.env'
})



app.listen(8000 || process.env.PORT, ()=>{
    console.log(`Server is running on PORT: ${8000 || process.env.PORT}`)
});