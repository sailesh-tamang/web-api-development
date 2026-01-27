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
};
