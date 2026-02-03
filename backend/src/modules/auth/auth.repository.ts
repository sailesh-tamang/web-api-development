import { UserModel } from "../user/user.model";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const AuthRepository = {
  findByEmail: (email: string) => UserModel.findOne({ email }),
  createUser: (data: CreateUserData) => UserModel.create(data),
  findById: (id: string) => UserModel.findById(id),
  findAll: () => UserModel.find().select("-password"),
  updateUser: (id: string, data: Partial<CreateUserData & { image?: string }>) =>
    UserModel.findByIdAndUpdate(id, data, { new: true }).select("-password"),
  deleteUser: (id: string) => UserModel.findByIdAndDelete(id),
};
