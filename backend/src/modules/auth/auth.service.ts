import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "./auth.repository";
import { LoginDto, RegisterDto } from "./auth.dto";

export const AuthService = {
  async register(data: RegisterDto) {
    const existing = await AuthRepository.findByEmail(data.email);
    if (existing) {
      return { ok: false, status: 409, message: "Email already exists" };
    }

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await AuthRepository.createUser({
      name: data.name,
      email: data.email,
      password: hashed,
      role: "user",
    });

    return {
      ok: true,
      status: 201,
      message: "User registered successfully",
      user: { id: user._id, email: user.email, role: user.role },
    };
  },

  async login(data: LoginDto) {
    const user = await AuthRepository.findByEmail(data.email);
    if (!user) {
      return { ok: false, status: 404, message: "User not found" };
    }

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) {
      return { ok: false, status: 401, message: "Invalid credentials" };
    }

    const secret = process.env.JWT_SECRET || "change_me_local_secret";
    const expiresIn = process.env.JWT_EXPIRES_IN || "1d";

    const token = (jwt.sign as any)(
      { sub: user._id.toString(), email: user.email, role: user.role },
      secret,
      { expiresIn }
    );

    return {
      ok: true,
      status: 200,
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, role: user.role },
    };
  },
};
