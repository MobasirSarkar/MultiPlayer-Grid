export interface HistoryUpdate {
    id: string;
    x: number;
    y: number;
    character: string;
    playerId: string;
    timestamp: string;
    action: string;
}

export interface GroupedHistoryUpdate {
    timestamp: string;
    updates: HistoryUpdate[];
    count: number;
}

export interface HistoryResponse {
    updates: GroupedHistoryUpdate[] | HistoryUpdate[];
    total: number;
    page: number;
    hasMore: boolean;
}

export interface HistoryStats {
    totalUpdates: number;
    uniquePlayers: number;
    recentUpdates: HistoryUpdate[];
}
