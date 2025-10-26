"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridController = void 0;
const grid_1 = require("../services/grid");
const gridService = new grid_1.GridService();
class GridController {
    async getGridState(req, res) {
        try {
            const grid = await gridService.getGridState();
            res.json({
                grid,
                success: true,
            });
        }
        catch (error) {
            console.error("Get grid state error: ", error);
            res.status(500).json({
                error: "Failed to fetch grid state",
                success: false,
            });
        }
    }
    async getPlayerStatus(req, res) {
        try {
            const { sessionId } = req.params;
            const status = await gridService.getPlayerStatus(sessionId);
            res.json(status);
        }
        catch (error) {
            console.error("Get player status error: ", error);
            res.status(500).json({
                error: "Failed to fetch player status",
            });
        }
    }
}
exports.GridController = GridController;
