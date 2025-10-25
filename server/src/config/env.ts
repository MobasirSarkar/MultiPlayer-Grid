import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const WS_STATUS_ONLINE = Number.parseInt(
    process.env.WS_STATUS_ONLINE || "30000",
);

export const COOLDOWN_DURATION = Number.parseInt(
    process.env.COOLDOWN_DURATION || "60000",
);
