import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (localfilePath) => {
    try {
        if (!localfilePath) return null;

        const result = await cloudinary.uploader.upload(localfilePath, {
            resource_type: "auto"
        });
        fs.unlinkSync(localfilePath);

        return result;  
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        fs.unlinkSync(localfilePath);
        return null;
    }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return null;
  }
};


export default {uploadToCloudinary, deleteFromCloudinary};
