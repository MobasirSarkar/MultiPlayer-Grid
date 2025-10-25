import React from 'react';

interface GridCellProps {
    x: number;
    y: number;
    character: string | null;
    isSelected: boolean;
    onClick: () => void;
    disabled: boolean;
}

export const GridCell: React.FC<GridCellProps> = ({
    character,
    isSelected,
    onClick,
    disabled,
}) => {
    const isStriped = character === null;

    return (
        <button
            onClick={onClick}
            disabled={disabled || character !== null}
            className={`
        aspect-square flex items-center justify-center text-4xl font-bold
        border-4 border-primary transition-all
        ${isStriped
                    ? 'bg-linear-to-br from-grid-white via-grid-white to-grid-striped bg-size-[20px_20px]'
                    : 'bg-grid-white'
                }
        ${isSelected ? 'ring-4 ring-blue-500 scale-95' : ''}
        ${disabled || character !== null ? 'cursor-not-allowed opacity-70' : 'hover:scale-95 cursor-pointer'}
        ${character ? 'text-primary' : 'text-gray-300'}
      `}
            style={
                isStriped
                    ? {
                        backgroundImage:
                            'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(156, 204, 101, 0.3) 10px, rgba(156, 204, 101, 0.3) 20px)',
                    }
                    : {}
            }
        >
            {character || ''}
        </button>
    );
};
