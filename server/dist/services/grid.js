"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridService = void 0;
const env_1 = require("../config/env");
const primsa_1 = require("../lib/primsa");
class GridService {
    async getGridState() {
        const cells = await primsa_1.prisma.gridCell.findMany({
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
    async updateCell(x, y, character, playerId) {
        const player = await primsa_1.prisma.player.findUnique({
            where: {
                sessionId: playerId,
            },
        });
        if (player?.hasSubmitted) {
            throw new Error("ALREADY_SUBMITTED");
        }
        if (player?.cooldownExpiry && new Date() < player.cooldownExpiry) {
            const remaining = Math.ceil((player.cooldownExpiry.getTime() - Date.now()) / 1000);
            throw new Error(`COOLDOWN_ACTIVE:${remaining}`);
        }
        const cooldownExpiry = new Date(Date.now() + env_1.COOLDOWN_DURATION);
        const result = await primsa_1.prisma.$transaction(async (tx) => {
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
    async getPlayerStatus(sessionId) {
        const player = await primsa_1.prisma.player.findUnique({
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
        let cooldownExpiry = null;
        if (player.cooldownExpiry) {
            const now = new Date();
            const expiryDate = new Date(player.cooldownExpiry);
            if (now < player.cooldownExpiry) {
                cooldownRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / 1000);
                canUpdate = false;
                cooldownExpiry = player.cooldownExpiry.toISOString();
            }
            else {
                await primsa_1.prisma.player.update({
                    where: { sessionId },
                    data: { cooldownExpiry: null },
                });
            }
        }
        return {
            hasSubmitted: player.hasSubmitted,
            cooldownRemaining,
            canUpdate,
            cooldownExpiry: cooldownExpiry,
        };
    }
}
exports.GridService = GridService;
