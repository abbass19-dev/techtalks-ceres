import { User } from "@/lib/models/User";
import { connectToDatabase } from "@/lib/db";

export const userRepository = {

  async findByEmail(email: string) {
    await connectToDatabase();
    return User.findOne({ email }).exec();
  },

  async findByResetToken(token: string) {
    await connectToDatabase();
    return User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).exec();
  },

  async updateUser(id: string, updateData: any) {
    await connectToDatabase();
    return User.findByIdAndUpdate(id, updateData, { new: true }).exec();
  },
};
