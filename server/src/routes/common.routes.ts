import { Router } from "express";
import { HealthController } from "../controllers/common.controller";

const commonRouter: Router = Router();

commonRouter.get("/health", HealthController);

export default commonRouter;
