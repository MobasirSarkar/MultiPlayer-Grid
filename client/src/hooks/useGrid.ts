import { useCallback, useState } from "react";
import type { GridState } from "../types/grid.types";

export const useGrid = () => {
    const [gridState, setGridState] = useState<GridState>({
        cells: Array(10)
            .fill(null)
            .map(() => Array(10).fill(null)),
        playerCount: 0,
    });

    const initializeGrid = useCallback((gridData: any[]) => {
        const newCells = Array(10)
            .fill(null)
            .map(() => Array(10).fill(null));

        gridData.forEach((cell) => {
            if (cell.x >= 0 && cell.x < 10 && cell.y >= 0 && cell.y < 10) {
                newCells[cell.y][cell.x] = cell.character;
            }
        });

        setGridState((prev) => ({
            ...prev,
            cells: newCells,
        }));
    }, []);

    const updateCell = useCallback(
        (x: number, y: number, character: string) => {
            setGridState((prev) => {
                const newCells = prev.cells.map((row) => [...row]);
                newCells[y][x] = character;
                return { ...prev, cells: newCells };
            });
        },
        [],
    );

    const updatePlayerCount = useCallback((count: number) => {
        setGridState((prev) => ({
            ...prev,
            playerCount: count,
        }));
    }, []);

    return {
        gridState,
        initializeGrid,
        updateCell,
        updatePlayerCount,
    };
};
