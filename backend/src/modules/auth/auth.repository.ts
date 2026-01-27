import { UserModel } from "../user/user.model";

export const AuthRepository = {
  findByEmail: (email: string) => UserModel.findOne({ email }),
  createUser: (data: any) => UserModel.create(data),
};
