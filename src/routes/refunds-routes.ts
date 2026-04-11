import { Router } from "express";
import multer from "multer";
import { RefundsController } from "@/controllers/refunds-controller";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import uploadConfig from "@/configs/upload";

const refundsRoutes = Router();
const refundsController = new RefundsController();
const upload = multer(uploadConfig.MULTER);

refundsRoutes.post(
  "/",
  verifyUserAuthorization(["manager"]),
  upload.single("file"),
  refundsController.create,
);
refundsRoutes.get(
  "/",
  verifyUserAuthorization(["manager"]),
  refundsController.index,
);
refundsRoutes.get(
  "/:id",
  verifyUserAuthorization(["employee", "manager"]),
  refundsController.show,
);

export { refundsRoutes };
