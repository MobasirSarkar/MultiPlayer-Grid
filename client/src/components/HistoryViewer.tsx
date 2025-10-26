import React, { useEffect } from "react"
import { Clock, Zap } from "lucide-react"
import { useHistory } from "../hooks/useHistory"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Card } from "./ui/card"
import type { GroupedHistoryUpdate } from "@/types/history.types"

export const HistoryViewer: React.FC = () => {
    const [isOpen, setIsOpen] = React.useState(false)
    const { history, stats, loading, error, refresh } = useHistory()

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp)
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
    }

    useEffect(() => {
        if (isOpen) refresh();
    }, [isOpen, refresh])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="fixed bottom-6 right-6 rounded-full shadow-lg h-12 px-6 gap-2" size="lg">
                    <Clock className="w-5 h-5" />
                    <span>History</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0">
                <DialogHeader className="shrink-0 px-6 py-4 border-b">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <DialogTitle className="text-2xl font-bold">Grid History</DialogTitle>
                            <DialogDescription>
                                View all recent grid updates group by timestamp, including player activity and submitted characters.
                            </DialogDescription>
                        </div>
                    </div>

                    {stats && (
                        <p className="text-sm text-muted-foreground mt-1">
                            <span className="font-semibold text-foreground">{stats.totalUpdates}</span> updates from{" "}
                            <span className="font-semibold text-foreground">{stats.uniquePlayers}</span> players
                        </p>
                    )}
                </DialogHeader>

                <div className="flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-3 p-6">
                        {loading && history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
                                <p className="text-muted-foreground mt-4 text-sm">Loading history...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="text-destructive mb-3">
                                    <Zap className="w-8 h-8" />
                                </div>
                                <p className="text-destructive font-medium text-center">{error}</p>
                                <Button onClick={refresh} variant="outline" className="mt-4 bg-transparent">
                                    Retry
                                </Button>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <Clock className="w-8 h-8 text-muted-foreground mb-3" />
                                <p className="text-muted-foreground text-sm text-center">
                                    No history yet. Be the first to make an update!
                                </p>
                            </div>
                        ) : (
                            history.map((group: GroupedHistoryUpdate) => (
                                // update card
                                <Card key={group.timestamp} className="overflow-hidden border">
                                    <div className="px-4 py-3 bg-muted/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm font-semibold text-foreground">{formatTimestamp(group.timestamp)}</span>
                                        </div>
                                        <Badge variant="secondary" className="font-medium border">
                                            {group.count} {group.count === 1 ? "update" : "updates"}
                                        </Badge>
                                    </div>

                                    <div className="divide-y">
                                        {group.updates.map((update: any) => (
                                            <div key={update.id} className="px-4 hover:bg-muted/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="shrink-0 w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center font-semibold text-lg p-6">
                                                        {update.character}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-foreground">
                                                            Cell ({update.x}, {update.y})
                                                        </p>
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {update.playerId.substring(0, 8)}...
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
