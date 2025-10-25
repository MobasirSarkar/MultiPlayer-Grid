import { prisma } from "../lib/primsa";

interface HistoryQuery {
    page: number;
    limit: number;
    grouped: boolean;
}

interface GroupedUpdate {
    group_timestamp: Date;
    updates: Array<{
        x: number;
        y: number;
        character: string;
        playerId: string;
        timestamp: Date;
    }>;
}

export class HistoryService {
    async getHistory({ page, limit, grouped }: HistoryQuery) {
        const skip = (page - 1) * limit;

        if (!grouped) {
            // simple list of updates
            const updates = await prisma.gridHistory.findMany({
                skip,
                take: limit,
                orderBy: { timestamp: "desc" },
            });

            const total = await prisma.gridHistory.count();

            return {
                updates,
                total,
                page,
                hasMore: skip + updates.length < total,
            };
        }

        const updates = await prisma.$queryRaw<GroupedUpdate[]>`
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

        const total = await prisma.gridHistory.count();

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
        const total = await prisma.gridHistory.count();
        const uniquePlayers = await prisma.gridHistory.groupBy({
            by: ["playerId"],
        });

        const recentUpdates = await prisma.gridHistory.findMany({
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
