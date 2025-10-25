import React, { useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import type { GroupedHistoryUpdate } from '../types/history.types';

export const HistoryViewer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { history, stats, loading, error, hasMore, loadMore, refresh } = useHistory();

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View History
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Grid History</h2>
                        {stats && (
                            <p className="text-sm text-gray-600 mt-1">
                                {stats.totalUpdates} total updates from {stats.uniquePlayers} players
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading && history.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="text-gray-600 mt-4">Loading history...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600">{error}</p>
                            <button
                                onClick={refresh}
                                className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-green-600"
                            >
                                Retry
                            </button>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No history yet. Be the first to make an update!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((group: GroupedHistoryUpdate, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-gray-700">
                                            {formatTimestamp(group.timestamp)}
                                        </span>
                                        <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                                            {group.count} {group.count === 1 ? 'update' : 'updates'}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {group.updates.map((update: any) => (
                                            <div
                                                key={update.id}
                                                className="flex items-center gap-3 bg-white p-3 rounded border border-gray-200"
                                            >
                                                <div className="shrink-0 w-12 h-12 bg-primary bg-opacity-10 rounded flex items-center justify-center">
                                                    <span className="text-2xl">{update.character}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-800">
                                                        Cell ({update.x}, {update.y})
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Player: {update.playerId.substring(0, 8)}...
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {hasMore && (
                                <button
                                    onClick={loadMore}
                                    disabled={loading}
                                    className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-medium transition-colors"
                                >
                                    {loading ? 'Loading...' : 'Load More'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
