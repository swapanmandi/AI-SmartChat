import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      requried: true,
    },
    email: {
      type: String,
      requried: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      requried: true,
    },
    refreshToken:{
      type: String
    }
  },
  {
    timestamps: true,
  }
);

// hash the password
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

// generate accesstoken

userSchema.methods.generateAccessToken = function(){
    return  jwt.sign({
        _id: this._id,
        fullName: this.fullName,
        email: this.email,
        password: this.password
    },
process.env.ACCESS_TOKEN_SECRET,{
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
}
)
}

// GENERATE refreshtoken

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id : this._id
    },
process.env.REFRESH_TOKEN_SECRET,{
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
})
}


export const User = mongoose.model("User", userSchema)