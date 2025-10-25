import { COOLDOWN_DURATION } from "../config/env";
import { prisma } from "../lib/primsa";

export class GridService {
    async getGridState() {
        const cells = await prisma.gridCell.findMany({
            orderBy: [
                {
                    x: "asc",
                },
                {
                    y: "asc",
                },
            ],
        });

        return cells;
    }

    async updateCell(
        x: number,
        y: number,
        character: string,
        playerId: string,
    ) {
        const player = await prisma.player.findUnique({
            where: {
                sessionId: playerId,
            },
        });

        if (player?.hasSubmitted) {
            throw new Error("ALREADY_SUBMITTED");
        }

        if (player?.cooldownExpiry && new Date() < player.cooldownExpiry) {
            const remaining = Math.ceil(
                (player.cooldownExpiry.getTime() - Date.now()) / 100,
            );

            throw new Error(`COOLDOWN_ACTIVE:${remaining}`);
        }

        const cooldownExpiry = new Date(Date.now() + COOLDOWN_DURATION);

        const result = await prisma.$transaction(async (tx) => {
            const cell = await tx.gridCell.upsert({
                where: {
                    x_y: { x, y },
                },
                update: {
                    character,
                    playerId,
                    updatedAt: new Date(),
                },
                create: {
                    x,
                    y,
                    character,
                    playerId,
                },
            });

            await tx.player.upsert({
                where: { sessionId: playerId },
                update: {
                    lastSubmitted: new Date(),
                    cooldownExpiry: cooldownExpiry,
                },
                create: {
                    sessionId: playerId,
                    lastSubmitted: new Date(),
                    cooldownExpiry: cooldownExpiry,
                },
            });

            await tx.gridHistory.create({
                data: {
                    x,
                    y,
                    character,
                    playerId,
                    action: "UPDATE",
                },
            });

            return { cell, cooldownExpiry };
        });

        return result;
    }

    async getPlayerStatus(sessionId: string) {
        const player = await prisma.player.findUnique({
            where: { sessionId },
        });

        if (!player) {
            return {
                hasSubmitted: false,
                cooldownRemaining: null,
                canUpdate: true,
                cooldownExpiry: null,
            };
        }

        let cooldownRemaining = null;
        let canUpdate = true;
        if (player.cooldownExpiry && new Date() < player.cooldownExpiry) {
            cooldownRemaining = Math.ceil(
                (player.cooldownExpiry.getTime() - Date.now()) / 1000,
            );
            canUpdate = false;
        }

        return {
            hasSubmitted: player.hasSubmitted,
            cooldownRemaining,
            canUpdate,
            cooldownExpiry: player.cooldownExpiry?.toISOString() || null,
        };
    }
}
