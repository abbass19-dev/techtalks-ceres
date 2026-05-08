import { NextRequest } from "next/server";
import { uploadImageToCloudinary } from "@/lib/services/cloudinary.service";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export class RequestParseError extends Error {
  constructor(public message: string, public status: number = 400) {
    super(message);
    this.name = "RequestParseError";
  }
}

const validateImage = (imageFile: File | null) => {
  if (!imageFile) return false;
  if (imageFile.size > MAX_FILE_SIZE) {
    throw new RequestParseError("Image size exceeds the 5MB limit", 400);
  }
  if (!ALLOWED_MIME_TYPES.has(imageFile.type)) {
    throw new RequestParseError("Invalid file type. Allowed: JPEG, PNG, WEBP, GIF", 400);
  }
  return true;
};

const handleMultipartForm = async <T>(req: NextRequest): Promise<T> => {
  const formData = await req.formData();
  const bodyStr = formData.get("data");
  
  if (!bodyStr || typeof bodyStr !== "string") {
    throw new RequestParseError("Missing recipe data", 400);
  }

  let body: T;
  try {
    body = JSON.parse(bodyStr) as T;
  } catch {
    throw new RequestParseError("Invalid recipe data JSON", 400);
  }

  const imageFile = formData.get("image") as File | null;
  
  if (validateImage(imageFile)) {
    const bytes = await imageFile!.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      const imageUrl = await uploadImageToCloudinary(buffer);
      (body as T & { imageUrl?: string }).imageUrl = imageUrl;
    } catch {
      throw new RequestParseError("Failed to upload image to cloud storage", 500);
    }
  }

  return body;
};

const handleJson = async <T>(req: NextRequest): Promise<T> => {
  return (await req.json()) as T;
};

type ParserFn = <T>(req: NextRequest) => Promise<T>;

const parsers: Record<string, ParserFn> = {
  "multipart/form-data": handleMultipartForm,
  "application/json": handleJson,
};

export const parseRecipeRequest = async <T>(req: NextRequest): Promise<T> => {
  const contentType = req.headers.get("content-type") || "";
  
  const matchedStrategy = Object.keys(parsers).find(key => contentType.includes(key));
  
  if (!matchedStrategy) {
    throw new RequestParseError("Unsupported Content-Type. Use application/json or multipart/form-data", 415);
  }

  return await parsers[matchedStrategy]<T>(req);
};
