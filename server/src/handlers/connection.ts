import { WebSocket } from "ws";
import { GridService } from "../services/grid";
import WebSocketManger from "../managers/websocket";

const gridService = new GridService();

export async function handleConnection(
    ws: WebSocket,
    message: any,
    wsManager: WebSocketManger,
) {
    try {
        const { sessionId } = message.payload;
        const gridState = await gridService.getGridState();
        const playerCount = wsManager.getPlayerCount();
        const playerStatus = await gridService.getPlayerStatus(sessionId);

        ws.send(
            JSON.stringify({
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
            }),
        );

        wsManager.broadcast({
            type: "PLAYER_COUNT",
            payload: {
                count: playerCount,
            },
        });
    } catch (error: any) {
        console.error("connection handler error: ", error);
        ws.send(
            JSON.stringify({
                type: "ERROR",
                payload: {
                    message: "failed to initialize connection",
                },
            }),
        );
    }
}
