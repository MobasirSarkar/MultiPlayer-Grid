import React from 'react';
import { GridCell } from './GridCell';

interface GridProps {
    cells: (string | null)[][];
    selectedCell: { x: number; y: number } | null;
    onCellClick: (x: number, y: number) => void;
    disabled: boolean;
}

export const Grid: React.FC<GridProps> = ({
    cells,
    selectedCell,
    onCellClick,
    disabled,
}) => {
    return (
        <div className="grid grid-cols-10 gap-2 p-8 bg-gray-50 rounded-3xl shadow-2xl max-w-3xl mx-auto">
            {cells.map((row, y) =>
                row.map((character, x) => (
                    <GridCell
                        key={`${x}-${y}`}
                        x={x}
                        y={y}
                        character={character}
                        isSelected={selectedCell?.x === x && selectedCell?.y === y}
                        onClick={() => onCellClick(x, y)}
                        disabled={disabled}
                    />
                ))
            )}
        </div>
    );
};
