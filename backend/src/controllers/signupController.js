import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Signup } from "../models/signupModel.js";



const generateAccessAndRefreshToken = async (userId) =>{
try {
    const user = await Signup.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false})
    return {accessToken, refreshToken}

} catch (error) {
  throw new ApiError(500, "Something went wrong while generating access and refresh token.")
}
}

const signupUser = asyncHandler(async (req, res) => {
  const {email, password, fullName} = req.body;
  console.log('email', email)
  if ([email, password, fullName].some(item => item?.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }

  const existedUser = await Signup.findOne({email} );

  if(existedUser){
    throw new ApiError(409, "Email already Registered.")
  }

const user = await Signup.create({
    email, password, fullName
})

const createdUser = await Signup.findById(user._id).select(" -password -refreshToken")

if(!createdUser){
throw new ApiError(500, "Wrong While Registering User")
}


return  res.status(200).json(
    new ApiResponse(200, createdUser, "User Registered Sucessfully.")
)
});


export {signupUser}