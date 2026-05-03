import { v2 as cloudinary } from "cloudinary";

// ✅ Check environment variables on load
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log("[CLOUDINARY] Config check:", {
  cloudName: !!cloudName,
  apiKey: !!apiKey,
  apiSecret: !!apiSecret,
});

if (!cloudName || !apiKey || !apiSecret) {
  console.error("[CLOUDINARY] Missing environment variables!");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export const uploadImageToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = "recipes"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error("[CLOUDINARY] Upload error:", error);
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }
        if (result?.secure_url) {
          console.log("[CLOUDINARY] Upload success:", result.secure_url);
          return resolve(result.secure_url);
        }
        console.error("[CLOUDINARY] Unknown error - no secure_url");
        return reject(new Error("Unknown error during Cloudinary upload"));
      }
    );
    uploadStream.end(fileBuffer);
  });
};
