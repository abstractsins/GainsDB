import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.auth_token; // Adjust based on your auth method

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded; // Attach user data to request
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden" });
  }
};

export default authMiddleware;
