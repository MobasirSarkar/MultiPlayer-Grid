"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOLDOWN_DURATION = exports.WS_STATUS_ONLINE = exports.NODE_ENV = exports.FRONTEND_URL = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
exports.FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
exports.NODE_ENV = process.env.NODE_ENV || "development";
exports.WS_STATUS_ONLINE = Number.parseInt(process.env.WS_STATUS_ONLINE || "30000");
exports.COOLDOWN_DURATION = Number.parseInt(process.env.COOLDOWN_DURATION || "60000");
