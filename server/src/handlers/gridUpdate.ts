import { WebSocket } from "ws";
import { GridService } from "../services/grid";
import WebSocketManger from "../managers/websocket";

const gridService = new GridService();

export async function handleGridUpdate(
    ws: WebSocket,
    message: any,
    wsManager: WebSocketManger,
    clientId: string,
) {
    try {
        const { x, y, character, sessionId } = message.payload;
        if (
            typeof x !== "number" ||
            x < 0 ||
            x > 9 ||
            typeof y !== "number" ||
            y < 0 ||
            y > 9 ||
            typeof character !== "string" ||
            character.length === 0 ||
            character.length > 10
        ) {
            ws.send(
                JSON.stringify({
                    type: "UPDATE_REJECTED",
                    payload: {
                        reason: "Invalid input parameters",
                        code: "INVALID_INPUT",
                    },
                }),
            );
            return;
        }
        const result = await gridService.updateCell(x, y, character, sessionId);

        // broadcast to all clients
        wsManager.broadcast(
            {
                type: "GRID_UPDATED",
                payload: {
                    x,
                    y,
                    character,
                    playerId: sessionId,
                    timestamp: result.cell.updatedAt.toISOString(),
                },
            },
            clientId,
        );
        // send cooldown message to the player
        ws.send(
            JSON.stringify({
                type: "COOLDOWN_STARTED",
                payload: {
                    expiresAt: result.cooldownExpiry.toISOString(),
                    remainingSeconds: 60,
                },
            }),
        );
    } catch (error: any) {
        if (error.message === "ALREADY_SUBMITTED") {
            ws.send(
                JSON.stringify({
                    type: "UPDATE_REJECTED",
                    payload: {
                        reason: "You have already submitted a character",
                        code: "ALREADY_SUBMITTED",
                    },
                }),
            );
        } else if (error.message.startsWith("COOLDOWN_ACTIVE")) {
            const remaining = error.message.split(":")[1];
            ws.send(
                JSON.stringify({
                    type: "UPDATE_REJECTED",
                    payload: {
                        reason: `Please wait ${remaining} seconds`,
                        code: "COOLDOWN_ACTIVE",
                        remainingSeconds: Number.parseInt(remaining),
                    },
                }),
            );
        } else {
            console.error("Grid update error: ", error);
            ws.send(
                JSON.stringify({
                    type: "UPDATE_REJECTED",
                    payload: {
                        reason: "Internal server error",
                        code: "SERVER_ERROR",
                    },
                }),
            );
        }
    }
}
