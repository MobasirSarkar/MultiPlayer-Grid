import { Request, Response } from "express";
import { GridService } from "../services/grid";

const gridService = new GridService();

export class GridController {
    async getGridState(req: Request, res: Response) {
        try {
            const grid = await gridService.getGridState();
            res.json({
                grid,
                success: true,
            });
        } catch (error) {
            console.error("Get grid state error: ", error);
            res.status(500).json({
                error: "Failed to fetch grid state",
                success: false,
            });
        }
    }

    async getPlayerStatus(req: Request, res: Response) {
        try {
            const { sessionId } = req.params;
            const status = await gridService.getPlayerStatus(sessionId);
            res.json(status);
        } catch (error) {
            console.error("Get player status error: ", error);
            res.status(500).json({
                error: "Failed to fetch player status",
            });
        }
    }
}
