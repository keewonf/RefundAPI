import { Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { hash } from "bcrypt";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";

const bodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters long" }),
  email: z.email({ message: "Invalid e-mail" }).trim(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z
    .enum([UserRole.employee, UserRole.manager])
    .default(UserRole.employee),
});

class UsersController {
  async create(req: Request, res: Response) {
    const { name, email, password, role } = bodySchema.parse(req.body);

    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new AppError("User with same email already exists");
    }

    const hashedPassword = await hash(password, 8);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return res.status(201).json({ message: "Created!" });
  }
}

export { UsersController };
