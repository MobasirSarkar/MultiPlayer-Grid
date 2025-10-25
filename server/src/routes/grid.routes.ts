import { Router } from "express";
import { GridController } from "../controllers/grid.controller";

const router: Router = Router();
const gridController = new GridController();

router.get("/", gridController.getGridState.bind(gridController));
router.get(
    "/player/:sessionId",
    gridController.getPlayerStatus.bind(gridController),
);

export default router;
