import { Router } from "express";
import { usersRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { refundsRoutes } from "./refunds-routes";

const routes = Router();

//Public routes
routes.use("/sessions", sessionsRoutes);
routes.use("/users", usersRoutes);

//Private routes
routes.use(ensureAuthenticated);
routes.use("/refunds", refundsRoutes);

export { routes };
