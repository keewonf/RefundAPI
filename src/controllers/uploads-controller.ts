import { Request, Response } from "express";
import z from "zod";

import uploadConfig from "@/configs/upload";

class UploadsController {
  async create(req: Request, res: Response) {
    try {
      const fileSchema = z
        .object({
          filename: z.string().min(1, { message: "File is required" }),
          mimetype: z
            .string()
            .refine(
              (type) => uploadConfig.ACCEPTED_IMAGE_TYPES.includes(type),
              {
                message:
                  "Invalid file format. Valid formats are " +
                  uploadConfig.ACCEPTED_IMAGE_TYPES,
              },
            ),
          size: z
            .number()
            .positive()
            .refine((size) => size <= uploadConfig.MAX_FILE_SIZE, {
              message:
                "File max size exceeded. Maximum file size is " +
                uploadConfig.MAX_SIZE,
            }),
        })
        .loose();

      const file = fileSchema.parse(req.file);

      res.json({ message: "ok" });
    } catch (error) {
      throw error;
    }
  }
}

export { UploadsController };
