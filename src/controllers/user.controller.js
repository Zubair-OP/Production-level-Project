import { asyncHandler } from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import uploadToCloudinary from '../utils/cloudinary.js';
import ApiResponse from '../utils/apiresponse.js';

// ==================== TOKEN GENERATOR ====================
const RefreshandAccesstoken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const AccessToken = user.generateAccessToken();
    const RefreshToken = user.generateRefreshToken();

    user.refreshToken = RefreshToken;
    await user.save({ validateBeforeSave: false });

    return { AccessToken, RefreshToken };
  } catch (error) {
    throw new ApiError(500, 'Internal server error for access and refresh token');
  }
};

// ==================== REGISTER ====================
const registerUser = asyncHandler(async (req, res) => {
  const { username, password, email, name } = req.body;

  if ([username, password, email, name].some((field) => field?.trim() === '')) {
    throw new ApiError('All fields are required', 400);
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError('Username or email already exists', 409);
  }

  const AvatarlocalPath = req.files?.avatar?.[0]?.path;
  let imagelocalPath;

  if (
    req.files &&
    req.files.coverImage &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    imagelocalPath = req.files.coverImage[0].path;
  }

  if (!AvatarlocalPath) {
    throw new ApiError(400, 'Avatar file is required');
  }

  const avatar = await uploadToCloudinary(AvatarlocalPath);
  const coverImage = imagelocalPath
    ? await uploadToCloudinary(imagelocalPath)
    : null;

  if (!avatar) {
    throw new ApiError(400, 'Avatar file is required');
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    name,
    avatar: avatar.url,
    coverImage: coverImage?.url || undefined,
  });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  if (!createdUser) {
    throw new ApiError('Internal Server Error', 500);
  }

  res.status(201).json({
    data: new ApiResponse(createdUser, 'User registered successfully'),
  });
});

// ==================== LOGIN ====================
const loginUser = asyncHandler(async (req, res) => {
  console.log('REQ BODY: ', req.body);
  const { email, password, username } = req.body;

  if (!email && !username) {
    throw new ApiError(400, 'username or email is incorrect');
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  const Validpassword = await user.isPasswordcorrect(password);

  if (!Validpassword) {
    throw new ApiError(401, 'Invalid user credentials');
  }

  const { RefreshToken, AccessToken } = await RefreshandAccesstoken(user._id);

  const loginUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  const options = {
    httpOnly: true,
    secure: false, // 🚨 localhost پر false رکھو، production میں true کر دینا
  };

  return res
    .status(200)
    .cookie('AccessToken', AccessToken, options)
    .cookie('RefreshToken', RefreshToken, options)
    .json(
      new ApiResponse(200, 'Login successful', {
        user: loginUser,
        AccessToken,
        RefreshToken,
      })
    );
});

// ==================== LOGOUT ====================
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: false, // localhost کیلئے false
  };

  return res
    .status(200)
    .clearCookie('AccessToken', options)
    .clearCookie('RefreshToken', options)
    .json(new ApiResponse(200, {}, 'User Logged Out'));
});

export { registerUser, loginUser, logoutUser };
