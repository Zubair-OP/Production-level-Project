import {asyncHandler} from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import uploadToCloudinary from '../utils/cloudinary.js'
import ApiResponse from '../utils/apiresponse.js';
import router from '../routes/user.routes.js';

const registerUser = asyncHandler(async (req, res) => {
    // Registration logic here


    // fetch user data from frontend
    const { username, password, email, name } = req.body;

    // Validate required fields
    if ([username, password, email, name].some(field => field?.trim() === '')) {
        throw new ApiError('All fields are required', 400);
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    // If user exists, throw an error
    if (existedUser){
        throw new ApiError('Username or email already exists', 409);
    }

    // Upload avatar and cover image to local server
    const AvatarlocalPath = req.files?.avatar?.[0]?.path;
    
    // const imagelocalPath = req.files?.coverImage?.[0]?.path;

    let imagelocalPath ;

    if (req.files && req.files.coverImage && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0 ) {
        imagelocalPath = req.files.coverImage[0].path
    }

    // Validate avatar file
    if (!AvatarlocalPath) {
        throw new ApiError(400,'Avatar file is required')
    }

    // Upload avatar to cloudinary
    const avatar = await uploadToCloudinary(AvatarlocalPath);
    const coverImage = await uploadToCloudinary(imagelocalPath);
    



    // Validate avatar upload
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }


    // Create new user
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
        name,
        avatar: avatar.url,
        coverImage: coverImage?.url || undefined
    })

    // Fetch the created user without password and refreshToken fields
    const createdUser = await User.findById(user._id).select('-password -refreshToken');

    // If user creation failed, throw an error
    if (!createdUser) {
        throw new ApiError('Internal Server Error', 500);
    }

    // Respond with the created user
    res.status(201).json({
        data: new ApiResponse(createdUser, 'User registered successfully')
    })
});


export {registerUser};