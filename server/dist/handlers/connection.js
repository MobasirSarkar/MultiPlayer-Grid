"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConnection = handleConnection;
const grid_1 = require("../services/grid");
const gridService = new grid_1.GridService();
async function handleConnection(ws, message, wsManager) {
    try {
        const { sessionId } = message.payload;
        const gridState = await gridService.getGridState();
        const playerCount = wsManager.getPlayerCount();
        const playerStatus = await gridService.getPlayerStatus(sessionId);
        ws.send(JSON.stringify({
            type: "GRID_INIT",
            payload: {
                grid: gridState,
                playerCount,
                playerStatus: {
                    hasSubmitted: playerStatus.hasSubmitted,
                    cooldownRemaining: playerStatus.cooldownRemaining,
                    canUpdate: playerStatus.canUpdate,
                    cooldownExpiry: playerStatus.cooldownExpiry,
                },
            },
        }));
        wsManager.broadcast({
            type: "PLAYER_COUNT",
            payload: {
                count: playerCount,
            },
        });
    }
    catch (error) {
        console.error("connection handler error: ", error);
        ws.send(JSON.stringify({
            type: "ERROR",
            payload: {
                message: "failed to initialize connection",
            },
        }));
    }
}
