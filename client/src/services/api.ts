const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const apiService = {
    async getHistory(
        page: number = 1,
        limit: number = 50,
        grouped: boolean = true,
    ) {
        const response = await fetch(
            `${API_URL}/api/history?page=${page}&limit=${limit}&grouped=${grouped}`,
        );

        if (!response.ok) {
            throw new Error("Failed to fetch history");
        }
        return response.json();
    },

    async getHistoryStats() {
        const response = await fetch(`${API_URL}/api/history/stats`);
        if (!response.ok) {
            throw new Error("Failed to fetch history stats");
        }
        return response.json();
    },

    async getPlayerStatus(sessionId: string) {
        const response = await fetch(`${API_URL}/api/grid/player/${sessionId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch player status");
        }

        return response.json();
    },
};
