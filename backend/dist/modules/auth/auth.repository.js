"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const user_model_1 = require("../user/user.model");
exports.AuthRepository = {
    findByEmail: (email) => user_model_1.UserModel.findOne({ email }),
    createUser: (data) => user_model_1.UserModel.create(data),
    findById: (id) => user_model_1.UserModel.findById(id),
    findAll: () => user_model_1.UserModel.find().select("-password"),
    findAllWithPagination: async (options) => {
        const { page = 1, limit = 10 } = options;
        const skip = (page - 1) * limit;
        const total = await user_model_1.UserModel.countDocuments();
        const users = await user_model_1.UserModel.find()
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
    updateUser: (id, data) => user_model_1.UserModel.findByIdAndUpdate(id, data, { new: true }).select("-password"),
    deleteUser: (id) => user_model_1.UserModel.findByIdAndDelete(id),
};
//# sourceMappingURL=auth.repository.js.map