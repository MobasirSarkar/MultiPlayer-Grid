"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = __importDefault(require("./app"));
const ws_1 = require("ws");
const websocket_1 = __importDefault(require("./managers/websocket"));
const connection_1 = require("./handlers/connection");
const gridUpdate_1 = require("./handlers/gridUpdate");
const env_1 = require("./config/env");
const server = (0, http_1.createServer)(app_1.default);
const wss = new ws_1.WebSocketServer({ server, path: "/ws" });
const wsManager = new websocket_1.default();
wss.on("connection", (ws) => {
    let clientId = null;
    ws.on("message", async (data) => {
        try {
            const message = JSON.parse(data.toString());
            switch (message.type) {
                case "CONNECT":
                    clientId = wsManager.addClient(ws, message.payload.sessionId);
                    await (0, connection_1.handleConnection)(ws, message, wsManager);
                    console.log(`Client connected: ${clientId}`);
                    break;
                case "GRID_UPDATE":
                    if (clientId) {
                        await (0, gridUpdate_1.handleGridUpdate)(ws, message, wsManager, clientId);
                    }
                    break;
                case "HEARTBEAT":
                    if (clientId) {
                        wsManager.updateOnline(clientId);
                        ws.send(JSON.stringify({
                            type: "HEARTBEAT_ACK",
                            payload: {
                                timestamp: Date.now(),
                            },
                        }));
                    }
                    break;
                default:
                    console.log("Unknown message type: ", message.type);
                    ws.send(JSON.stringify({
                        type: "ERROR",
                        payload: {
                            message: `Unknown message type: ${message.type}`,
                        },
                    }));
            }
        }
        catch (error) {
            console.error("WebSocket message error: ", error);
            ws.send(JSON.stringify({
                type: "ERROR",
                payload: {
                    message: "Invalid message format",
                },
            }));
        }
    });
    ws.on("close", () => {
        if (clientId) {
            wsManager.removeClient(clientId);
            console.log(`Client disconnected: ${clientId}`);
            wsManager.broadcast({
                type: "PLAYER_COUNT",
                payload: {
                    count: wsManager.getPlayerCount(),
                },
            });
        }
    });
    ws.on("error", (error) => {
        console.error("WebSocket error: ", error);
    });
});
wsManager.startOnlineStatusCheck(env_1.WS_STATUS_ONLINE);
server.listen(env_1.PORT, () => {
    console.log(`Server running on port: ${env_1.PORT}`);
    console.log(`WebSocket server running on ws://localhost:${env_1.PORT}/ws`);
});
