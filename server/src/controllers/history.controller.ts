import { Request, Response } from "express";
import { HistoryService } from "../services/history";

const historyService = new HistoryService();

export class HistoryController {
    async getHistory(req: Request, res: Response) {
        const page = Number.parseInt(req.query.page as string) || 1;
        const limit = Number.parseInt(req.query.limit as string) || 50;
        const grouped = req.query.grouped === "true";

        try {
            const result = await historyService.getHistory({
                page,
                limit,
                grouped,
            });

            res.json(result);
        } catch (error) {
            console.error("Get history error: ", error);
            res.status(500).json({
                error: "Failed to fetch history",
            });
        }
    }

    async getHistoryStats(req: Request, res: Response) {
        try {
            const stats = await historyService.getHistoryStats();
            res.json(stats);
        } catch (error) {
            console.error("get history stats error: ", error);
            res.status(500).json({
                error: "Failed to fetch history stats",
            });
        }
    }
}
