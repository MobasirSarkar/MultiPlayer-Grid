export interface GridCell {
    id: string;
    x: number;
    y: number;
    character: string;
    playerId: string;
    updatedAt: string;
    createdAt: string;
}

export interface GridState {
    cells: (string | null)[][];
    playerCount: number;
}

export interface PlayerStatus {
    hasSubmitted: boolean;
    cooldownRemaining: number | null;
    canUpdate: boolean;
}
