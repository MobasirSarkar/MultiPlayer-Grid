
import React from 'react';

interface PlayerCountProps {
    count: number;
}

export const PlayerCount: React.FC<PlayerCountProps> = ({ count }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Players Online:</span>
                <span className="text-2xl font-bold text-primary">{count}</span>
            </div>
        </div>
    );
};
