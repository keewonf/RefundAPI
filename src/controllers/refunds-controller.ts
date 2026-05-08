import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { Category } from "@/generated/prisma/client";

const bodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name must be at least 1 characters long" }),
  amount: z.coerce
    .number()
    .positive({ message: "Value must be a positive number" }),
  category: z.enum(Category),
  filename: z.string().min(1, { message: "Filename is required" }),
});

const paramsSchema = z.object({
  id: z.uuid(),
});

const querySchema = z.object({
  name: z.string().optional().default(""),
  page: z.coerce.number().optional().default(1),
  perPage: z.coerce.number().optional().default(10),
});

class RefundsController {
  async create(req: Request, res: Response) {
    const parsedBody = bodySchema.safeParse(req.body);

    if (!parsedBody.success) {
      throw new AppError(
        parsedBody.error.issues[0]?.message ?? "Invalid request body",
        400,
      );
    }

    const { name, amount, category, filename } = parsedBody.data;

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
        fileKey: filename,
        originalFilename: filename,
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

  async show(req: Request, res: Response) {
    const { id } = paramsSchema.parse(req.params);

    const refund = await prisma.refunds.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const { fileKey, ...refundData } = refund ?? {};

    res.json({
      ...refundData,
      filename: fileKey,
    });
  }
}

export { RefundsController };
