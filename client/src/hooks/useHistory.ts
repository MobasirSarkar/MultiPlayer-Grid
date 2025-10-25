import { useCallback, useEffect, useState } from "react";
import type {
    GroupedHistoryUpdate,
    HistoryStats,
} from "../types/history.types";
import { apiService } from "../services/api";

export const useHistory = () => {
    const [history, setHistory] = useState<GroupedHistoryUpdate[]>([]);
    const [stats, setStats] = useState<HistoryStats | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(false);

    const fetchHistory = useCallback(async (page: number = 1) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiService.getHistory(page, 50, true);
            setHistory(data.updates);
            setHasMore(data.hasMore);
            setCurrentPage(page);
        } catch (error) {
            setError("Failed to load history");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const data = await apiService.getHistoryStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to load stats: ", error);
        }
    }, []);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            fetchHistory(currentPage + 1);
        }
    }, [loading, hasMore, currentPage, fetchHistory]);

    const refresh = useCallback(() => {
        fetchHistory(1);
        fetchStats();
    }, [fetchHistory, fetchStats]);

    useEffect(() => {
        refresh();
    }, []);

    return {
        history,
        stats,
        loading,
        error,
        hasMore,
        loadMore,
        refresh,
    };
};
