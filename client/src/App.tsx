import { useState, useEffect } from 'react';
import { Grid } from './components/Grid';
import { PlayerCount } from './components/PlayerCount';
import { ConnectionStatus } from './components/ConnectionStatus';
import { HistoryViewer } from './components/HistoryViewer';
import { useWebSocket } from './hooks/useWebSocket';
import { useGrid } from './hooks/useGrid';
import { getSessionId } from './utils/sessionManage';
import { useCoolDown } from './hooks/useCooldown';
import { CooldownAlert } from './components/CooldownAlert';
import { CharacterInputDialog } from './components/CharacterDialog';
import { useWebSocketHandler } from './hooks/useWebsocketHandler';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws';

function App() {
    const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const sessionId = getSessionId();

    const { gridState, initializeGrid, updateCell, updatePlayerCount } = useGrid();
    const { startCooldown, isCoolDownActive, updateCoolDown, coolDownRemaining, clearCoolDown } = useCoolDown();

    const { handleMessage } = useWebSocketHandler({
        initializeGrid,
        updateCell,
        updatePlayerCount,
        startCooldown,
        updateCoolDown,
        clearCoolDown,
        sessionId,
    });

    const { isConnected, sendMessage } = useWebSocket({
        url: WS_URL,
        onMessage: handleMessage,
    });

    useEffect(() => {
        if (isConnected) {
            sendMessage({
                type: 'CONNECT',
                payload: { sessionId },
            });

            const heartbeatInterval = setInterval(() => {
                sendMessage({
                    type: 'HEARTBEAT',
                    payload: { timestamp: Date.now() },
                });
            }, 25000);

            return () => clearInterval(heartbeatInterval);
        }
    }, [isConnected, sendMessage, sessionId]);

    const handleCellClick = (x: number, y: number) => {
        if (!isCoolDownActive && gridState.cells[y][x] === null && isConnected) {
            setSelectedCell({ x, y });
            setIsDialogOpen(true);
        }
    };

    const handleCharacterSubmit = (character: string) => {
        if (selectedCell && !isCoolDownActive) {
            updateCell(selectedCell.x, selectedCell.y, character);
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

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedCell(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <ConnectionStatus isConnected={isConnected} />

            <div className="container mx-auto">
                <h1 className="text-5xl font-bold text-center mb-8 text-gray-800">
                    Multiplayer Grid
                </h1>

                <PlayerCount count={gridState.playerCount} />

                <div className="py-3">
                    <CooldownAlert isActive={isCoolDownActive} remainingSeconds={coolDownRemaining} />
                </div>

                <Grid
                    cells={gridState.cells}
                    selectedCell={selectedCell}
                    onCellClick={handleCellClick}
                    disabled={isCoolDownActive || !isConnected}
                />
            </div>

            <CharacterInputDialog
                isOpen={isDialogOpen}
                onClose={handleDialogClose}
                onSubmit={handleCharacterSubmit}
                selectedCell={selectedCell}
                disabled={isCoolDownActive || !isConnected}
            />

            <HistoryViewer />
        </div>
    );
}

export default App;
