import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = "recipes"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result?.secure_url) return resolve(result.secure_url);
        
        console.error("Cloudinary upload error:", error);
        return reject(error || new Error("Unknown error during Cloudinary upload"));
      }
    );
    uploadStream.end(fileBuffer);
  });
};
