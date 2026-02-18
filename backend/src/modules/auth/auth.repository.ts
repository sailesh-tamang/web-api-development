import { UserModel } from "../user/user.model";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
  age?: number;
  height?: number;
  weight?: number;
}

interface PaginationOptions {
  page: number;
  limit: number;
}

export const AuthRepository = {
  findByEmail: (email: string) => UserModel.findOne({ email }),
  createUser: (data: CreateUserData) => UserModel.create(data),
  findById: (id: string) => UserModel.findById(id),
  findAll: () => UserModel.find().select("-password"),
  findAllWithPagination: async (options: PaginationOptions) => {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;
    
    const total = await UserModel.countDocuments();
    const users = await UserModel.find()
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    return {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        usersPerPage: limit,
      },
    };
  },
  updateUser: (id: string, data: Partial<CreateUserData & { image?: string; resetToken?: string | null; resetTokenExpiry?: Date | null }>) =>
    UserModel.findByIdAndUpdate(id, data, { new: true }).select("-password"),
  deleteUser: (id: string) => UserModel.findByIdAndDelete(id),
};
