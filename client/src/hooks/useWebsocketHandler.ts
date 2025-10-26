import { useCallback } from "react";
import { toast } from "sonner";

interface UseWebSocketHandlerProps {
    initializeGrid: (grid: any[]) => void;
    updateCell: (x: number, y: number, character: string) => void;
    updatePlayerCount: (count: number) => void;
    startCooldown: (expiresAt: string) => void;
    updateCoolDown: (remaining: number) => void;
    clearCoolDown: () => void;
    sessionId: string;
}

export const useWebSocketHandler = ({
    initializeGrid,
    updateCell,
    updatePlayerCount,
    startCooldown,
    updateCoolDown,
    clearCoolDown,
    sessionId,
}: UseWebSocketHandlerProps) => {
    const handleMessage = useCallback(
        (message: any) => {
            switch (message.type) {
                case "GRID_INIT":
                    initializeGrid(message.payload.grid);
                    updatePlayerCount(message.payload.playerCount);

                    if (message.payload?.playerStatus) {
                        const status = message.payload.playerStatus;

                        if (
                            status.cooldownExpiry &&
                            status.cooldownRemaining &&
                            status.cooldownRemaining > 0
                        ) {
                            console.log(
                                "Restoring cooldown:",
                                status.cooldownRemaining,
                                "seconds remaining",
                            );
                            startCooldown(status.cooldownExpiry);
                            toast.info(
                                `Cooldown active: ${status.cooldownRemaining} seconds remaining`,
                            );
                        } else {
                            clearCoolDown();
                        }
                    }
                    break;

                case "GRID_UPDATED":
                    // Only update if it's from another player
                    if (message.payload.playerId !== sessionId) {
                        updateCell(
                            message.payload.x,
                            message.payload.y,
                            message.payload.character,
                        );
                    }
                    break;

                case "PLAYER_COUNT":
                    updatePlayerCount(message.payload.count);
                    break;

                case "COOLDOWN_STARTED":
                    startCooldown(message.payload.expiresAt);
                    toast.success(
                        "Character submitted! You can update again in 1 minute.",
                    );
                    break;

                case "UPDATE_REJECTED":
                    if (message.payload.code === "COOLDOWN_ACTIVE") {
                        updateCoolDown(message.payload.remainingSeconds);
                    }
                    toast.error(message.payload.reason);
                    break;

                case "HEARTBEAT_ACK":
                    console.log(
                        "Heartbeat acknowledged at:",
                        new Date(message.payload.timestamp).toISOString(),
                    );
                    break;

                case "ERROR":
                    console.error("Server error:", message.payload.message);
                    toast.error(message.payload.message || "An error occurred");
                    break;

                default:
                    console.log("Unknown message type:", message.type);
            }
        },
        [
            initializeGrid,
            updateCell,
            updatePlayerCount,
            startCooldown,
            updateCoolDown,
            clearCoolDown,
            sessionId,
        ],
    );

    return { handleMessage };
};
