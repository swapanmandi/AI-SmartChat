import {User} from "../models/user.model.js"
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from '../utils/asyncHandler.js'



const generateAccessAndRefreshTokens  = asyncHandler( async (userId) =>{
try {
    const user = User.findById(userId);
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})
    return {accessToken, refreshToken}
} catch (error) {
    throw new ApiError(500, "Error while generating access and refresh tokens")
}
})

const signupUser = asyncHandler(async (req, res)=>{

    const {fullName, email, password} = req.body

    console.log(req.body)

    if([fullName, email, password].some(item => item?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({email})
    if(existedUser){
        throw new ApiError(400, "Email is already Registered.")
    }

    const user = await User.create({
        fullName, email, password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering user.")
    }

    return res.status(200).json(
        new ApiResponse(500, createdUser, "User Registered Successfully!")
    )
})

export {signupUser}