import { createServer } from "http";
import app from "./app";
import { WebSocket, WebSocketServer } from "ws";
import WebSocketManger from "./managers/websocket";
import { handleConnection } from "./handlers/connection";
import { handleGridUpdate } from "./handlers/gridUpdate";
import { PORT, WS_STATUS_ONLINE } from "./config/env";

const server = createServer(app);

const wss = new WebSocketServer({ server, path: "/ws" });
const wsManager = new WebSocketManger();

wss.on("connection", (ws: WebSocket) => {
    let clientId: string | null = null;

    ws.on("message", async (data: Buffer) => {
        try {
            const message = JSON.parse(data.toString());

            switch (message.type) {
                case "CONNECT":
                    clientId = wsManager.addClient(
                        ws,
                        message.payload.sessionId,
                    );
                    await handleConnection(ws, message, wsManager);
                    console.log(`Client connected: ${clientId}`);
                    break;

                case "GRID_UPDATE":
                    if (clientId) {
                        await handleGridUpdate(
                            ws,
                            message,
                            wsManager,
                            clientId,
                        );
                    }
                    break;

                case "HEARTBEAT":
                    if (clientId) {
                        wsManager.updateOnline(clientId);
                        ws.send(
                            JSON.stringify({
                                type: "HEARTBEAT_ACK",
                                payload: {
                                    timestamp: Date.now(),
                                },
                            }),
                        );
                    }
                    break;
                default:
                    console.log("Unknown message type: ", message.type);
                    ws.send(
                        JSON.stringify({
                            type: "ERROR",
                            payload: {
                                message: `Unknown message type: ${message.type}`,
                            },
                        }),
                    );
            }
        } catch (error) {
            console.error("WebSocket message error: ", error);
            ws.send(
                JSON.stringify({
                    type: "ERROR",
                    payload: {
                        message: "Invalid message format",
                    },
                }),
            );
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

wsManager.startOnlineStatusCheck(WS_STATUS_ONLINE);

server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    console.log(`WebSocket server running on ws://localhost:${PORT}/ws`);
});
