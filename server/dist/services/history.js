"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryService = void 0;
const primsa_1 = require("../lib/primsa");
class HistoryService {
    async getHistory({ page, limit, grouped }) {
        const skip = (page - 1) * limit;
        if (!grouped) {
            // simple list of updates
            const updates = await primsa_1.prisma.gridHistory.findMany({
                skip,
                take: limit,
                orderBy: { timestamp: "desc" },
            });
            const total = await primsa_1.prisma.gridHistory.count();
            return {
                updates,
                total,
                page,
                hasMore: skip + updates.length < total,
            };
        }
        const updates = await primsa_1.prisma.$queryRaw `
          SELECT 
            DATE_TRUNC('second', timestamp) as group_timestamp,
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'x', x,
                'y', y,
                'character', character,
                'playerId', "playerId",
                'timestamp', timestamp
              )
              ORDER BY timestamp
            ) as updates
          FROM "GridHistory"
          GROUP BY group_timestamp
          ORDER BY group_timestamp DESC
          LIMIT ${limit}
          OFFSET ${skip}
        `;
        const total = await primsa_1.prisma.gridHistory.count();
        return {
            updates: updates.map((group) => ({
                timestamp: group.group_timestamp,
                updates: group.updates,
                count: Array.isArray(group.updates) ? group.updates.length : 0,
            })),
            total,
            page,
            hasMore: Array.isArray(updates) && updates.length === limit,
        };
    }
    async getHistoryStats() {
        const total = await primsa_1.prisma.gridHistory.count();
        const uniquePlayers = await primsa_1.prisma.gridHistory.groupBy({
            by: ["playerId"],
        });
        const recentUpdates = await primsa_1.prisma.gridHistory.findMany({
            take: 10,
            orderBy: { timestamp: "desc" },
        });
        return {
            totalUpdates: total,
            uniquePlayers: uniquePlayers.length,
            recentUpdates,
        };
    }
}
exports.HistoryService = HistoryService;
