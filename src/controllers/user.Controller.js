import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudniary.js";

export const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, password, username } = req.body;
  console.log("email:", email, "password:", password);

  if (
    [fullName, email, password, username].some((filed) => filed?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username },{ email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or userName already exists");
  }

  // console.log("files:", req.files);
  let coverImageloacalpath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageloacalpath = req.files.coverImage[0].path
  }

  let avatarloacalpath;
  if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
    avatarloacalpath = req.files.avatar[0].path
  }

  if (!avatarloacalpath) {
    throw new ApiError(400, "Avatar files are required");
  }
const avatar = await uploadOnCloudinary(avatarloacalpath);
const coverImage = await uploadOnCloudinary(coverImageloacalpath);

if (!avatar || !avatar.url) {
  console.error("Avatar upload failed:", avatar);
  throw new ApiError(400, "Avatar files are required");
}
const user = await User.create({
  fullName,
  avatar: avatar?.url,
  coverImage: coverImage?.url || "", // Optional, depending on your logic
  email,
  password,
  username: username.toLowerCase(),
});

console.log("User created:", user);

return res
  .status(201)
  .json(new ApiResponse(200, user, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req,res) => {
  //req.body ----> data;
  // username or email ------> validation check hoga ;
  // find the user 
  // password check
  //access and refresh token 
  //send cookies
})

