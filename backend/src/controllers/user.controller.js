import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const signupUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, avatar } = req.body;

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
    avatar
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

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //console.log(req.body);

  if (!email && !password) {
    throw new ApiError(400, "Email and Password are required.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist.");
  }

  //console.log("tokens", generateAccessAndRefreshTokens(user._id));

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "User credentials are incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    " -password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production",
    //path: '/',
    maxAge: 7200000,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in Successfully!"
      )
    );
});

//user log out

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: false,
  };
  return res
    .cookie("accessToken", options)
    .cookie("refreshToken", options)
    .status(200)
    .json(new ApiResponse(200, {}, "User Log Out Successfully!"));
});

//Refresh access token

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  console.log("inc to", incomingRefreshToken);

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request from frontend.");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    console.log("user", user);
    console.log("incomingrefreshtoken", incomingRefreshToken);
    console.log("userrefreshtoken", user?.refreshToken);

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used.");
    }

    const options = {
      httpOnly: true,
      secure: false,
    };

    const { accessToken, newRefreshToken } = generateAccessAndRefreshTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token is Refreshed."
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message, "Invalid Refresh Token");
  }
});

//get loggedin User

const getCurrentUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "User Fetched Successfully!"));
});



//get all users
const userList = asyncHandler(async(req, res) =>{
  const users = await User.find().select(" -refreshToken, -password ")

  if(!users){
    throw new ApiError(400, "There is no user")
  }

  return res.status(200).json(new ApiResponse(200, users, "Users fetched sussessfully."))
})


const getUser = asyncHandler(async(req, res) =>{
const {id: userId} = req.params
  const user = await User.findById(userId).select(" -password -refreshToken")

  if(!user){
    throw new ApiError(404, "User does not exist")
  }

  return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"))
})


export {
  signupUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  userList,
  getUser
};
