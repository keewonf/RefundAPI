import { Request, Response } from "express";
import z from "zod";
import { ZodError } from "zod";
import { CloudinaryStorage } from "@/providers/cloudinary-storage";
import { DiskStorage } from "@/providers/disk-storage";
import { AppError } from "@/utils/AppError";

class UploadsController {
  async create(req: Request, res: Response) {
    const cloudinaryStorage = new CloudinaryStorage();
    const diskStorage = new DiskStorage();

    try {
      const fileSchema = z
        .object({
          filename: z.string().min(1, { message: "File is required" }),
          mimetype: z.string(),
          size: z.number().positive(),
          path: z.string(),
        })
        .loose();

      const file = fileSchema.parse(req.file);
      if (!req.file) {
        throw new AppError("File is required");
      }

      // Upload para Cloudinary
      const cloudinaryFile = await cloudinaryStorage.saveFile(
        file.path,
        file.filename,
      );

      // Deleta arquivo temporário
      await diskStorage.deleteFile(file.filename, "tmp");

      res.json({
        filename: file.filename,
        fileUrl: cloudinaryFile.url,
        publicId: cloudinaryFile.publicId,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        if (req.file) {
          await diskStorage.deleteFile(req.file.filename, "tmp");
        }

        throw new AppError(error.issues[0].message);
      }

      throw error;
    }
  }
}

export { UploadsController };
