import { WebSocket } from "ws";
import { v4 as uuidV4 } from "uuid";

interface WebSocketClient {
    id: string;
    sessionId: string;
    socket: WebSocket;
    lastOnlineStatus: number;
}

class WebSocketManger {
    private clients: Map<string, WebSocketClient> = new Map();

    addClient(socket: WebSocket, sessionId: string): string {
        const clientId = uuidV4();
        this.clients.set(clientId, {
            id: clientId,
            sessionId,
            socket,
            lastOnlineStatus: Date.now(),
        });

        return clientId;
    }

    removeClient(clientId: string): void {
        this.clients.delete(clientId);
    }

    broadcast(message: object, excludeId?: string): void {
        const data = JSON.stringify(message);
        this.clients.forEach((client) => {
            if (
                client.id != excludeId &&
                client.socket.readyState === WebSocket.OPEN
            ) {
                client.socket.send(data);
            }
        });
    }

    sendToClient(clientId: string, message: object): void {
        const client = this.clients.get(clientId);
        if (client && client.socket.readyState === WebSocket.OPEN) {
            client.socket.send(JSON.stringify(message));
        }
    }

    getPlayerCount(): number {
        return this.clients.size;
    }

    updateOnline(clientId: string): void {
        const client = this.clients.get(clientId);
        if (client) {
            client.lastOnlineStatus = Date.now();
        }
    }

    startOnlineStatusCheck(interval: number): void {
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

    getClientBySessionId(sessionId: string): WebSocketClient | undefined {
        for (const client of this.clients.values()) {
            if (client.sessionId === sessionId) {
                return client;
            }
        }
        return undefined;
    }
}

export default WebSocketManger;
