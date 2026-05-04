import { userRepository } from "@/lib/repositories/user.repository";
import { UpdateProfileInput, updateProfileSchema } from "@/lib/validations/user";

export const userService = {
  async updateProfile(userId: string, input: UpdateProfileInput) {
    const validatedData = updateProfileSchema.parse(input);
    const updatedUser = await userRepository.updateUser(userId, validatedData);
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  }
};
