"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = HealthController;
function HealthController(req, res) {
    try {
        const now = new Date();
        const healthStatus = {
            status: "ok",
            uptime: process.uptime(),
            timestamp: now.toISOString(),
        };
        res.status(200).json(healthStatus);
    }
    catch (error) {
        res.status(200).json();
    }
}
