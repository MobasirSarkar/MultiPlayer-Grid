import React from 'react';

interface ConnectionStatusProps {
    isConnected: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
    return (
        <div className="fixed top-4 right-4 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg">
            <div
                className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'
                    } animate-pulse`}
            />
            <span className="text-sm font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
            </span>
        </div>
    );
};
