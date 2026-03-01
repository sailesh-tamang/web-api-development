import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type JwtPayloadExtended = {
  sub?: string;
  id?: string;
  email?: string;
  role?: string;
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  const token = auth.split(" ")[1] as string;

  try {
    const secret = (process.env.JWT_SECRET || "change_me_local_secret") as string;
    const payload = jwt.verify(token, secret) as JwtPayloadExtended;

    const userId = payload.sub || payload.id;
    if (!userId) {
      return res.status(401).json({ ok: false, message: "Invalid token payload" });
    }

    req.user = {
      id: userId,
      ...(payload.email ? { email: payload.email } : {}),
      ...(payload.role ? { role: payload.role } : {}),
    };

    next();
  } catch (_error) {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
};

export default authMiddleware;