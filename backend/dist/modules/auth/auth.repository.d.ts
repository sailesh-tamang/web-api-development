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
export declare const AuthRepository: {
    findByEmail: (email: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOne", {
        id: string;
    }>;
    createUser: (data: CreateUserData) => Promise<import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    findById: (id: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOne", {
        id: string;
    }>;
    findAll: () => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "find", {
        id: string;
    }>;
    findAllWithPagination: (options: PaginationOptions) => Promise<{
        users: (import("mongoose").Document<unknown, {}, {
            email: string;
            password: string;
            role: "user" | "admin";
            name?: string | null;
            image?: string | null;
            age?: number | null;
            height?: number | null;
            weight?: number | null;
            resetToken?: string | null;
            resetTokenExpiry?: NativeDate | null;
        } & import("mongoose").DefaultTimestampProps, {
            id: string;
        }, {
            timestamps: true;
        }> & Omit<{
            email: string;
            password: string;
            role: "user" | "admin";
            name?: string | null;
            image?: string | null;
            age?: number | null;
            height?: number | null;
            weight?: number | null;
            resetToken?: string | null;
            resetTokenExpiry?: NativeDate | null;
        } & import("mongoose").DefaultTimestampProps & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        })[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalUsers: number;
            usersPerPage: number;
        };
    }>;
    updateUser: (id: string, data: Partial<CreateUserData & {
        image?: string;
        resetToken?: string | null;
        resetTokenExpiry?: Date | null;
    }>) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOneAndUpdate", {
        id: string;
    }>;
    deleteUser: (id: string) => import("mongoose").Query<(import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }, {}, {
        email: string;
        password: string;
        role: "user" | "admin";
        name?: string | null;
        image?: string | null;
        age?: number | null;
        height?: number | null;
        weight?: number | null;
        resetToken?: string | null;
        resetTokenExpiry?: NativeDate | null;
        createdAt: NativeDate;
        updatedAt: NativeDate;
    } & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "findOneAndDelete", {
        id: string;
    }>;
};
export {};
//# sourceMappingURL=auth.repository.d.ts.map