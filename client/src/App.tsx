import { useState, useEffect, useCallback } from 'react';
import { Grid } from './components/Grid';
import { PlayerCount } from './components/PlayerCount';
import { CharacterInput } from './components/CharacterInput';
import { StatusMessage } from './components/StatusMessage';
import { ConnectionStatus } from './components/ConnectionStatus';
import { CooldownTimer } from './components/CooldownTimer';
import { HistoryViewer } from './components/HistoryViewer';
import { useWebSocket } from './hooks/useWebSocket';
import { useGrid } from './hooks/useGrid';
import { getSessionId } from './utils/sessionManage';
import { useCoolDown } from './hooks/useCooldown';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws';

function App() {
    const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
    const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
    const sessionId = getSessionId();

    const { gridState, initializeGrid, updateCell, updatePlayerCount } = useGrid();
    const { startCooldown, isCoolDownActive, updateCoolDown, coolDownRemaining } = useCoolDown();

    const handleWebSocketMessage = useCallback((message: any) => {
        switch (message.type) {
            case 'GRID_INIT':
                initializeGrid(message.payload.grid);
                updatePlayerCount(message.payload.playerCount);
                break;

            case 'GRID_UPDATED':
                updateCell(message.payload.x, message.payload.y, message.payload.character);
                break;

            case 'PLAYER_COUNT':
                updatePlayerCount(message.payload.count);
                break;

            case 'COOLDOWN_STARTED':
                startCooldown(message.payload.expiresAt);
                setStatusMessage({
                    text: 'Character submitted! You can update again in 1 minute.',
                    type: 'success',
                });
                setTimeout(() => setStatusMessage(null), 5000);
                break;

            case 'UPDATE_REJECTED':
                if (message.payload.code === 'COOLDOWN_ACTIVE') {
                    updateCoolDown(message.payload.remainingSeconds);
                }
                setStatusMessage({
                    text: message.payload.reason,
                    type: 'error',
                });
                setTimeout(() => setStatusMessage(null), 5000);
                break;

            case 'HEARTBEAT_ACK':
                break;

            default:
                console.log('Unknown message type:', message.type);
        }
    }, [initializeGrid, updateCell, updatePlayerCount, startCooldown, updateCoolDown]);

    const { isConnected, sendMessage } = useWebSocket({
        url: WS_URL,
        onMessage: handleWebSocketMessage,
    });

    useEffect(() => {
        if (isConnected) {
            sendMessage({
                type: 'CONNECT',
                payload: { sessionId },
            });

            const heartbeatInterval = setInterval(() => {
                sendMessage({
                    type: 'ONLINE_STATUS',
                    payload: { timestamp: Date.now() },
                });
            }, 25000);

            return () => clearInterval(heartbeatInterval);
        }
    }, [isConnected, sendMessage, sessionId]);

    const handleCellClick = (x: number, y: number) => {
        if (!isCoolDownActive && gridState.cells[y][x] === null) {
            setSelectedCell({ x, y });
        }
    };

    const handleCharacterSubmit = (character: string) => {
        if (selectedCell && !isCoolDownActive) {
            sendMessage({
                type: 'GRID_UPDATE',
                payload: {
                    x: selectedCell.x,
                    y: selectedCell.y,
                    character,
                    sessionId,
                },
            });

            setSelectedCell(null);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4">
            <ConnectionStatus isConnected={isConnected} />

            <div className="container mx-auto">
                <h1 className="text-5xl font-bold text-center mb-8 text-gray-800">
                    Multiplayer Grid
                </h1>

                <PlayerCount count={gridState.playerCount} />

                <Grid
                    cells={gridState.cells}
                    selectedCell={selectedCell}
                    onCellClick={handleCellClick}
                    disabled={isCoolDownActive || !isConnected}
                />

                {coolDownRemaining !== null && coolDownRemaining > 0 && (
                    <CooldownTimer remainingSeconds={coolDownRemaining} />
                )}

                <CharacterInput
                    onSubmit={handleCharacterSubmit}
                    disabled={isCoolDownActive || !isConnected}
                    selectedCell={selectedCell}
                />

                {statusMessage && (
                    <StatusMessage message={statusMessage.text} type={statusMessage.type} />
                )}

                {isCoolDownActive && (
                    <div className="max-w-2xl mx-auto mt-6 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 rounded">
                        Cooldown active! You can make another update after the timer expires.
                    </div>
                )}
            </div>

            <HistoryViewer />
        </div>
    );
}

export default App;
