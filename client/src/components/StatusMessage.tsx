
import React from 'react';

interface StatusMessageProps {
    message: string;
    type: 'success' | 'error' | 'info';
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ message, type }) => {
    const bgColor = {
        success: 'bg-green-100 border-green-500 text-green-700',
        error: 'bg-red-100 border-red-500 text-red-700',
        info: 'bg-blue-100 border-blue-500 text-blue-700',
    }[type];

    return (
        <div className={`max-w-2xl mx-auto mt-4 p-4 border-l-4 rounded ${bgColor}`}>
            {message}
        </div>
    );
};
