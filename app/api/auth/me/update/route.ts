import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/lib/services/user.service";
import { verifyAuth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

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
    let body: any = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      body = {
        firstName: formData.get("firstName") || "",
        lastName: formData.get("lastName") || "",
        email: formData.get("email") || "",
        phoneNumber: formData.get("phoneNumber") || "",
        age: Number(formData.get("age") || 0),
        weight: Number(formData.get("weight") || 0),
        height: Number(formData.get("height") || 0),
      };

      const image = formData.get("image") as File | null;

      if (image && image.size > 0) {
        const buffer = Buffer.from(await image.arrayBuffer());

        const uploaded: any = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "ceres/users" }, (error, result) => {
              if (error) reject(error);
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
        weight: updatedUser.weight,
        height: updatedUser.height,
        age: updatedUser.age,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}