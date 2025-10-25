import express, { Request, Response } from "express";
import cors from "cors";
import { FRONTEND_URL, NODE_ENV } from "./config/env";
import gridRoutes from "./routes/grid.routes";
import historyRoutes from "./routes/history.routes";
import commonRoutes from "./routes/common.routes";

const app = express();

app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/grid", gridRoutes);
app.use("/api/history", historyRoutes);
app.use("/common", commonRoutes);

app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
    console.error("Error: ", err);
    res.status(500).json({
        error: "interval server error",
        message: NODE_ENV === "development" ? err.message : undefined,
    });
});

export default app;
