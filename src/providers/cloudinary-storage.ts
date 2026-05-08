import { cloudinary } from "@/configs/cloudinary";
import { AppError } from "@/utils/AppError";

class CloudinaryStorage {
  async saveFile(filePath: string, fileName: string) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: fileName.replace(/\.[^/.]+$/, ""),
        resource_type: "auto",
        folder: "refunds",
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new AppError("Failed to upload file to cloud storage");
    }
  }

  async deleteFile(publicId: string) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      // Não lança erro, apenas registra
    }
  }
}

export { CloudinaryStorage };
