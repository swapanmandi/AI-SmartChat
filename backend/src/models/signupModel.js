import mongoose  from 'mongoose'

const signupSchema = new mongoose.schema({
email: {
    type: String,
    required: true,
    unique: true,
    lowercase:true
},
password:{
    type: String,
    required:true
}
},
{timestamps: true}
)

export const Signup = mongoose.model("Signup", signupSchema)