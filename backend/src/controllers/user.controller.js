import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshTokens = async(userId) =>{
  try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      return {accessToken, refreshToken}


  } catch (error) {
      throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
}



const signupUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  //console.log(req.body);

  if ([fullName, email, password].some((item) => item?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(400, "Email is already Registered.");
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user.");
  }

  return res
    .status(200)
    .json(new ApiResponse(500, createdUser, "User Registered Successfully!"));
});

//login user

const loginUser = asyncHandler (async (req, res) => {
  const { email, password } = req.body;

  console.log(req.body);
  

  if (!email && !password) {
    throw new ApiError(400, "Email and Password are required.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist.");
  }
  console.log('tokens', generateAccessAndRefreshTokens(user._id))
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "User credentials are incorrect");
  }

const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)


const loggedInUser = await User.findById(user._id).select(" -password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true
  };

  return res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,
      {
        user: loggedInUser, accessToken, refreshToken
      },
      "User logged in Successfully!"
    )
  );
});

export { signupUser, loginUser };
