
import React, { useState } from 'react';

interface CharacterInputProps {
    onSubmit: (character: string) => void;
    disabled: boolean;
    selectedCell: { x: number; y: number } | null;
}

export const CharacterInput: React.FC<CharacterInputProps> = ({
    onSubmit,
    disabled,
    selectedCell,
}) => {
    const [character, setCharacter] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (character.trim() && selectedCell) {
            onSubmit(character.trim());
            setCharacter('');
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-6">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Enter Character/Emoji
                    </label>
                    <input
                        type="text"
                        value={character}
                        onChange={(e) => setCharacter(e.target.value.slice(0, 10))}
                        disabled={disabled || !selectedCell}
                        placeholder="Type a character..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed text-lg"
                        maxLength={10}
                    />
                </div>

                {selectedCell && (
                    <div className="mb-4 text-sm text-gray-600">
                        Selected cell: ({selectedCell.x}, {selectedCell.y})
                    </div>
                )}

                <button
                    type="submit"
                    disabled={disabled || !character.trim() || !selectedCell}
                    className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    Submit Character
                </button>
            </form>
        </div>
    );
};
