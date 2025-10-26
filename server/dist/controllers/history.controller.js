"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryController = void 0;
const history_1 = require("../services/history");
const historyService = new history_1.HistoryService();
class HistoryController {
    async getHistory(req, res) {
        const page = Number.parseInt(req.query.page) || 1;
        const limit = Number.parseInt(req.query.limit) || 50;
        const grouped = req.query.grouped === "true";
        try {
            const result = await historyService.getHistory({
                page,
                limit,
                grouped,
            });
            res.json(result);
        }
        catch (error) {
            console.error("Get history error: ", error);
            res.status(500).json({
                error: "Failed to fetch history",
            });
        }
    }
    async getHistoryStats(req, res) {
        try {
            const stats = await historyService.getHistoryStats();
            res.json(stats);
        }
        catch (error) {
            console.error("get history stats error: ", error);
            res.status(500).json({
                error: "Failed to fetch history stats",
            });
        }
    }
}
exports.HistoryController = HistoryController;
