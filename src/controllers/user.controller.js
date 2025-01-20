import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //   message: "ok",
  // });

  // get user details from frontend
  // validation - not empty
  // check if user already exists : username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation -> it's successfully created or not
  // return response

  // get user details from frontend
  const { fullName, email, username, password } = req.body;
  // console.log("Email: ", email);

  // if(fullName === ""){
  //   throw new ApiError(400, "Fullname is required")
  // }

  // validation - not empty
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user already exists : username, email
  const existedUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // console.log(req.files.avatar[0])
  // check for images, check for avatar
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // upload them to cloudinary, avatar
  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath)
    console.log(avatar)
  } catch (err) {
    throw new ApiError(500, "Failed to upload avatar");
  }

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // let coverImageLocalPath;
  // if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
  //   coverImageLocalPath = req.files.coverImage[0].path;
  // }

  let coverImage = null;
  if(coverImageLocalPath){
    try {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
    } catch (err) {
      console.warn("Failed to upload cover Image : ", err.message);
    }
  }

  // create user object - create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar?.url||"",
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // remove password and refresh token field from response
  // const createdUser = await User.findById(user._id);
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check for user creation -> it's successfully created or not
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

export { registerUser };
