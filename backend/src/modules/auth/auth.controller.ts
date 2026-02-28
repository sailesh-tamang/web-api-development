import { Request, Response } from "express";
import { registerDto, loginDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import { PasswordResetService } from "./password-reset.service";
import bcrypt from "bcryptjs";
import { AuthRepository } from "./auth.repository";

export const AuthController = {
  async register(req: Request, res: Response) {
    const parsed = registerDto.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const result = await AuthService.register(parsed.data);
    return res.status(result.status).json(result);
  },

  async login(req: Request, res: Response) {
    const parsed = loginDto.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const result = await AuthService.login(parsed.data);
    return res.status(result.status).json(result);
  },

  async createUser(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body as any;
      if (!name || !email || !password) {
        return res.status(400).json({ ok: false, message: "Missing fields" });
      }

      const existing = await AuthRepository.findByEmail(email);
      if (existing) return res.status(409).json({ ok: false, message: "Email exists" });

      const hashed = await bcrypt.hash(password, 10);
      const image = (req as any).file ? (req as any).file.filename : undefined;

      const user = await AuthRepository.createUser({
        name,
        email,
        password: hashed,
        role: role || "user",
        ...(image ? { image } : {}),
      } as any);

      return res.status(201).json({ ok: true, message: "User created", user: { id: user._id, email: user.email, role: user.role } });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },

  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await AuthRepository.findById(id as string);
      if (!user) return res.status(404).json({ ok: false, message: "User not found" });
      return res.status(200).json({ ok: true, user });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },

  async getAllUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (page < 1 || limit < 1) {
        return res.status(400).json({ ok: false, message: "Invalid pagination parameters" });
      }

      const result = await AuthRepository.findAllWithPagination({ page, limit });
      return res.status(200).json({ ok: true, ...result });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const body = req.body as any;
      if ((req as any).file) {
        body.image = (req as any).file.filename;
      }
      if (body.password) {
        body.password = await bcrypt.hash(body.password, 10);
      }
      const updated = await AuthRepository.updateUser(id as string, body as any);
      if (!updated) return res.status(404).json({ ok: false, message: "User not found" });
      return res.status(200).json({ ok: true, user: updated });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ ok: false, message: "Email is required" });
      }

      const resetLinkBase = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password`;
      const result = await PasswordResetService.requestPasswordReset(email, resetLinkBase);
      
      if (!result.ok) {
        return res.status(400).json(result);
      }

      return res.status(200).json({
        ok: true,
        message: result.message,
        token: result.token,
        email: email
      });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, email, newPassword, confirmPassword } = req.body;

      if (!token || !email || !newPassword || !confirmPassword) {
        return res.status(400).json({ ok: false, message: "Missing required fields" });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ ok: false, message: "Passwords do not match" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ ok: false, message: "Password must be at least 6 characters" });
      }

      const result = await PasswordResetService.resetPassword(token, email, newPassword);
      return res.status(result.ok ? 200 : 400).json(result);
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },

  async validateResetToken(req: Request, res: Response) {
    try {
      const { token, email } = req.body;

      if (!token || !email) {
        return res.status(400).json({ ok: false, message: "Token and email are required" });
      }

      const result = await PasswordResetService.validateResetToken(token, email);
      return res.status(result.ok ? 200 : 400).json(result);
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await AuthRepository.deleteUser(id as string);
      if (!deleted) {
        return res.status(404).json({ ok: false, message: "User not found" });
      }
      return res.status(200).json({ ok: true, message: "User deleted successfully" });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },
};
