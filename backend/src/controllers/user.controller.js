import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
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
      "Something went wrong while generating access and refresh token."
    );
  }
};

//signup user

const signupUser = asyncHandler(async (req, res) => {
  const { email, password, fullName } = req.body;
  console.log("email", email);
  if ([email, password, fullName].some((item) => item?.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "Email already Registered.");
  }

  const user = await User.create({
    email,
    password,
    fullName,
  });

  const createdUser = await User.findById(user._id).select(
    " -password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Wrong While Registering User");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User Registered Sucessfully."));
});

//login user

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    throw new ApiError(400, "All Fields are Required.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exixt.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "User Credentials Invalid.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    " -password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "Logged in Successfully."
      )
    );
});

export { signupUser, loginUser };
