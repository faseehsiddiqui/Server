import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  email: string;
  role?: string;
}

export const tokenHandler = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1️⃣ Get token from cookie OR header
    const tokenFromCookie = req.cookies?.accessToken;

    const tokenFromHeader = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;

    const accessToken = tokenFromCookie || tokenFromHeader;

    // 2️⃣ Check if token exists
    if (!accessToken) {
      return res.status(401).json({ message: "Access token missing" });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // 4️⃣ Attach user to request
    req.user = decoded;

    next(); // ✅ allow request
  } catch (error: any) {
    // 5️⃣ Handle JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(401).json({ message: "Unauthorized" });
  }
};
