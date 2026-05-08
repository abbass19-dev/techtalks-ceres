import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/lib/services/user.service";
import { verifyAuth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
import type { UpdateProfileInput } from "@/lib/validations/user";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PATCH(req: NextRequest) {
  try {
    const userId = await verifyAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";
    let body: UpdateProfileInput = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      body = {
        firstName: String(formData.get("firstName") || ""),
        lastName: String(formData.get("lastName") || ""),
        phoneNumber: String(formData.get("phoneNumber") || ""),
      };

      const gender = String(formData.get("gender") || "");
      const activityLevel = String(formData.get("activityLevel") || "");
      const age = String(formData.get("age") || "");
      const weight = String(formData.get("weight") || "");
      const height = String(formData.get("height") || "");

      if (gender) body.gender = gender as UpdateProfileInput["gender"];
      if (activityLevel) {
        body.activityLevel = activityLevel as UpdateProfileInput["activityLevel"];
      }
      if (age) body.age = Number(age);
      if (weight) body.weight = Number(weight);
      if (height) body.height = Number(height);

      const image = formData.get("image") as File | null;

      if (image && image.size > 0) {
        const buffer = Buffer.from(await image.arrayBuffer());

        const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "ceres/users" }, (error, result) => {
              if (error || !result) reject(error || new Error("Upload failed"));
              else resolve(result);
            })
            .end(buffer);
        });

        body.imageUrl = uploaded.secure_url;
      }
    } else {
      body = await req.json();
    }

    const updatedUser = await userService.updateProfile(userId, body);

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id.toString(),
        imageUrl: updatedUser.imageUrl,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phoneNumber: updatedUser.phoneNumber,
        gender: updatedUser.gender,
        weight: updatedUser.weight,
        height: updatedUser.height,
        age: updatedUser.age,
        activityLevel: updatedUser.activityLevel,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
