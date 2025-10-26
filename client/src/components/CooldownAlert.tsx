import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

interface CooldownAlertProps {
    isActive: boolean;
    remainingSeconds: number | null;
}

export const CooldownAlert: React.FC<CooldownAlertProps> = ({ isActive, remainingSeconds }) => {
    if (!isActive || remainingSeconds === null) return null;

    const progress = ((60 - remainingSeconds) / 60) * 100;
    return (
        <Alert variant="default" className="max-w-2xl mx-auto mt-6">
            <AlertCircleIcon />
            <AlertTitle>Cooldown Active</AlertTitle>
            <AlertDescription>
                You can make another update in {remainingSeconds}{" "}
                {remainingSeconds === 1 ? "second" : "seconds"}.
                <div className="w-full bg-orange-200 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-orange-500 h-2 transition-all duration-1000 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-sm text-orange-600 mt-2">
                    You can update another cell after the cooldown expires
                </p>
            </AlertDescription>
        </Alert>
    );
};
