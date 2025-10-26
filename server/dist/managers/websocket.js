"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const uuid_1 = require("uuid");
class WebSocketManger {
    clients = new Map();
    addClient(socket, sessionId) {
        const clientId = (0, uuid_1.v4)();
        this.clients.set(clientId, {
            id: clientId,
            sessionId,
            socket,
            lastOnlineStatus: Date.now(),
        });
        return clientId;
    }
    removeClient(clientId) {
        this.clients.delete(clientId);
    }
    broadcast(message, excludeId) {
        const data = JSON.stringify(message);
        this.clients.forEach((client) => {
            if (client.id != excludeId &&
                client.socket.readyState === ws_1.WebSocket.OPEN) {
                client.socket.send(data);
            }
        });
    }
    sendToClient(clientId, message) {
        const client = this.clients.get(clientId);
        if (client && client.socket.readyState === ws_1.WebSocket.OPEN) {
            client.socket.send(JSON.stringify(message));
        }
    }
    getPlayerCount() {
        return this.clients.size;
    }
    updateOnline(clientId) {
        const client = this.clients.get(clientId);
        if (client) {
            client.lastOnlineStatus = Date.now();
        }
    }
    startOnlineStatusCheck(interval) {
        setInterval(() => {
            const now = Date.now();
            const timeout = 350000;
            this.clients.forEach((client, clientId) => {
                if (now - client.lastOnlineStatus > timeout) {
                    console.log(`Client ${clientId} time  out`);
                    client.socket.close();
                    this.removeClient(clientId);
                }
            });
        }, interval);
    }
    getClientBySessionId(sessionId) {
        for (const client of this.clients.values()) {
            if (client.sessionId === sessionId) {
                return client;
            }
        }
        return undefined;
    }
}
exports.default = WebSocketManger;
