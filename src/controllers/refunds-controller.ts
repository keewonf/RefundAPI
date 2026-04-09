import { Request, Response } from "express";
import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";

class RefundsController {
  async create(req: Request, res: Response) {
    res.json({ message: "ok" });
  }
}

export { RefundsController };
