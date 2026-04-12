import { User } from "@/lib/models/User";
import { connectToDatabase } from "@/lib/db";

export const userRepository = {
  async findByEmail(email: string) {
    await connectToDatabase();
    return User.findOne({ email }).exec();
  },

  async create(payload: {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    phoneNumber: string;
  }) {
    await connectToDatabase();
    return User.create(payload);
  },
};
