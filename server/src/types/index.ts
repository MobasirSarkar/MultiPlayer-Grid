export interface GridCell {
    character: string;
    playerId: string;
    playerName: string;
    timestamp: number | string;
}

export interface Player {
    id: string;
    name: string;
    hasSubmitted: boolean;
    lastSubmitTime: number | string;
    socketId: string;
}

export interface GridUpdate {
    row: number;
    cell: number;
    character: string;
    playerId: string;
    playerName: string;
    timestamp: number;
}

export interface UpdateCellData {
    row: number;
    cell: number;
    character: string;
}

export interface InitialState {
    grid: (GridCell | null)[][];
    playerCount: number;
    playerId: string;
    history: GridUpdate[];
}

export interface CellUpdateBroadcast {
    row: number;
    col: number;
    cell: GridCell;
}

export interface UpdateSuccessResponse {
    message: string;
    hasSubmitted?: boolean;
    cooldownSeconds?: number;
}
