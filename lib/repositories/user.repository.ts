import { User } from "@/lib/models/User";
import { connectToDatabase } from "@/lib/db";

export const userRepository = {

  async findByEmail(email: string) {
    await connectToDatabase();
    return User.findOne({ email }).exec();
  },
};
