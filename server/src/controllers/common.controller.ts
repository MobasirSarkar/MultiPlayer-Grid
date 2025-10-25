import { Request, Response } from "express";

export function HealthController(req: Request, res: Response) {
    try {
        const now: Date = new Date();
        const healthStatus = {
            status: "ok",
            uptime: process.uptime(),
            timestamp: now.toISOString(),
        };
        res.status(200).json(healthStatus);
    } catch (error) {
        res.status(200).json();
    }
}
