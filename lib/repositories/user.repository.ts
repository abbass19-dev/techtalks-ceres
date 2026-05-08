import { User } from "@/lib/models/User";
import { connectToDatabase } from "@/lib/db";

export const userRepository = {
  async findByEmail(email: string) {
    await connectToDatabase();
    return User.findOne({ email }).lean().exec();
  },

  async findByResetToken(token: string) {
    await connectToDatabase();
    return User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).lean().exec();
  },

  async create(payload: {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    phoneNumber: string;
    gender?: "male" | "female" | "other";
    age?: number;
    height?: number;
    weight?: number;
    activityLevel?: "sedentary" | "light" | "moderate" | "active";
  }) {
    await connectToDatabase();
    return User.create(payload);
  },

  async findById(id: string) {
    await connectToDatabase();
    return User.findById(id)
      .select(
        "_id email firstName lastName imageUrl phoneNumber gender weight height age activityLevel",
      )
      .lean()
      .exec();
  },

  async updateUser(id: string, updateData: Record<string, unknown>) {
    await connectToDatabase();
    return User.findByIdAndUpdate(id, updateData, { new: true }).lean().exec();
  },
};
