import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";

function verifyUserAuthorization(role: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !role.includes(user.role)) {
      throw new AppError("Unauthorized", 401);
    }

    return next;
  };
}

export { verifyUserAuthorization };
