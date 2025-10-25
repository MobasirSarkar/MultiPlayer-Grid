export interface WebSocketMessage {
    type: string;
    payload: any;
}

export interface GridInitMessage {
    type: "GRID_INIT";
    payload: {
        grid: any[];
        playerCount: number;
    };
}

export interface GridUpdatedMessage {
    type: "GRID_UPDATED";
    payload: {
        x: number;
        y: number;
        character: string;
        playerId: string;
        timestamp: string;
    };
}

export interface PlayerCountMessage {
    type: "PLAYER_COUNT";
    payload: {
        count: number;
    };
}

export interface UpdateRejectedMessage {
    type: "UPDATE_REJECTED";
    payload: {
        reason: string;
        code: string;
        remainingSeconds?: number;
    };
}
