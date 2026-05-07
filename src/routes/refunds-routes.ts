import { Router } from "express";
import { RefundsController } from "@/controllers/refunds-controller";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const refundsRoutes = Router();
const refundsController = new RefundsController();

refundsRoutes.post(
  "/",
  verifyUserAuthorization(["manager", "employee"]),
  refundsController.create,
);
refundsRoutes.get(
  "/",
  verifyUserAuthorization(["manager", "employee"]),
  refundsController.index,
);
refundsRoutes.get(
  "/:id",
  verifyUserAuthorization(["employee", "manager"]),
  refundsController.show,
);

export { refundsRoutes };
