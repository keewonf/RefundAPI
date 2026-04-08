import { Request, Response } from "express";
import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";

class UsersController {
  async create(req: Request, res: Response) {
    return res.status(201).json({ message: "ok" });
  }
}

export { UsersController };
