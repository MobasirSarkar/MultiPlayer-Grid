import { Router } from "express";
import { HistoryController } from "../controllers/history.controller";

const router: Router = Router();
const historyController = new HistoryController();

router.get("/", historyController.getHistory.bind(historyController));
router.get("/stats", historyController.getHistoryStats.bind(historyController));

export default router;
