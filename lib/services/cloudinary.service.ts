import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error("Missing Cloudinary environment variables");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export const uploadImageToCloudinary = async (
  fileBuffer: Buffer,
  folder = "recipes"
): Promise<string> => {
  if (!fileBuffer || fileBuffer.length === 0) {
    throw new Error("No image file provided");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }

        if (!result?.secure_url) {
          return reject(new Error("Cloudinary upload failed: no secure URL"));
        }

        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
};