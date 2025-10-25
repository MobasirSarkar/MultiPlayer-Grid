import { useCallback, useEffect, useRef, useState } from "react";

interface UseWebSocketProps {
    url: string;
    onMessage: (message: any) => void;
}

export const useWebSocket = ({ url, onMessage }: UseWebSocketProps) => {
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<number>(0);

    const connect = useCallback(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            return;
        }

        try {
            const ws = new WebSocket(url);

            ws.onopen = () => {
                setIsConnected(true);
                console.log("websocket connected.");
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    onMessage(message);
                } catch (error) {
                    console.error("failed to parse websocket message: ", error);
                }
            };

            ws.onclose = () => {
                setIsConnected(false);
                console.warn("websocket disconnected.");

                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log("attempting to reconnect...");
                    connect();
                }, 3000);
            };

            ws.onerror = (error) => {
                console.error("websocket error: ", error);
                ws.close();
            };
            wsRef.current = ws;
        } catch (error) {
            console.error("failed to establish websocket connection: ", error);
        }
    }, [url, onMessage]);

    useEffect(() => {
        connect();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [connect]);

    const sendMessage = useCallback((message: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.warn("cannot send message - websocket not connected.");
        }
    }, []);
    return { isConnected, sendMessage };
};
