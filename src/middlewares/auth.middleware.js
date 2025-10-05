import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js';



export const verifyUser = asyncHandler(async (req, _, next) => {
  try {
    const token = req.cookies?.AccessToken || req.header('Authorization')?.replace('Bearer ', ''); 

    if (!token) {
      throw new ApiError(401, 'Unauthorized');
    }

    const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedtoken._id).select('-password -refreshToken');

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, 'Unauthorized access token');
  }
});

// import ApiError from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";

// export const verifyUser = asyncHandler(async (req, _, next) => {
//   try {
//     // صرف cookie سے token read کرو
//     const token = req.cookies?.AccessToken;  

//     if (!token) {
//       throw new ApiError(401, "Unauthorized - No token found in cookies");
//     }

//     const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     const user = await User.findById(decodedtoken._id).select(
//       "-password -refreshToken"
//     );

//     if (!user) {
//       throw new ApiError(404, "User not found");
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     throw new ApiError(401, "Unauthorized access token");
//   }
// });

