import React from 'react';

interface CooldownTimerProps {
    remainingSeconds: number;
}

export const CooldownTimer: React.FC<CooldownTimerProps> = ({ remainingSeconds }) => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    const progress = ((60 - remainingSeconds) / 60) * 100;

    return (
        <div className="max-w-2xl mx-auto mt-4 bg-orange-100 border-l-4 border-orange-500 rounded p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-orange-700 font-medium">
                    Cooldown Active
                </span>
                <span className="text-2xl font-bold text-orange-600">
                    {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2 overflow-hidden">
                <div
                    className="bg-orange-500 h-2 transition-all duration-1000 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="text-sm text-orange-600 mt-2">
                You can update another cell after the cooldown expires
            </p>
        </div>
    );
};
