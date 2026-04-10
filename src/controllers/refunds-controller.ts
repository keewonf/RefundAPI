import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Category } from "@/generated/prisma/client";

const bodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name must be at least 1 characters long" }),
  amount: z.number().positive({ message: "Value must be a positive number" }),
  category: z.enum(Category),
  filename: z.string().trim().min(20),
});

const querySchema = z.object({
  name: z.string().optional().default(""),
  page: z.coerce.number().optional().default(1),
  perPage: z.coerce.number().optional().default(10),
});

class RefundsController {
  async create(req: Request, res: Response) {
    const { name, amount, category, filename } = bodySchema.parse(req.body);

    if (!req.user?.id) {
      throw new AppError("Unauthorized", 401);
    }

    const userExists = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!userExists) {
      throw new AppError("User not found");
    }

    const refund = await prisma.refunds.create({
      data: {
        name,
        category,
        amount,
        filename,
        userId: req.user.id,
      },
    });

    res.status(201).json(refund);
  }

  async index(req: Request, res: Response) {
    const { name, page, perPage } = querySchema.parse(req.query);

    const skip = (page - 1) * perPage;

    const refunds = await prisma.refunds.findMany({
      skip,
      take: perPage,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      where: {
        user: {
          name: {
            contains: name.trim(),
            mode: "insensitive",
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalRecords = await prisma.refunds.count({
      where: {
        user: {
          name: {
            contains: name.trim(),
            mode: "insensitive",
          },
        },
      },
    });

    const totalPages = Math.ceil(totalRecords / perPage);

    return res.json({
      refunds,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPages: totalPages > 0 ? totalPages : 1,
      },
    });
  }
}

export { RefundsController };
