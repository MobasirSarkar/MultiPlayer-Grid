import { useCallback, useEffect, useState } from "react";

export const useCoolDown = () => {
    const [coolDownRemaining, setCoolDownRemaining] = useState<number | null>(
        null,
    );

    const [coolDownExpiry, setCoolDownExpiry] = useState<Date | null>(null);

    const startCooldown = useCallback((expiresAt: string) => {
        const expiryDate = new Date(expiresAt);
        const now = new Date();
        if (expiryDate > now) {
            setCoolDownExpiry(expiryDate);

            const remaining = Math.ceil(
                (expiryDate.getTime() - Date.now()) / 1000,
            );
            setCoolDownRemaining(remaining > 0 ? remaining : null);
        } else {
            clearCoolDown();
        }
    }, []);

    const updateCoolDown = useCallback((remaining: number) => {
        setCoolDownRemaining(remaining);
    }, []);

    const clearCoolDown = useCallback(() => {
        setCoolDownRemaining(null);
        setCoolDownExpiry(null);
    }, []);

    useEffect(() => {
        if (coolDownExpiry) {
            const interval = setInterval(() => {
                const remaining = Math.ceil(
                    (coolDownExpiry.getTime() - Date.now()) / 1000,
                );
                if (remaining <= 0) {
                    clearCoolDown();
                } else {
                    setCoolDownRemaining(remaining);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [coolDownExpiry, clearCoolDown]);

    return {
        coolDownRemaining,
        isCoolDownActive: coolDownRemaining !== null && coolDownRemaining > 0,
        startCooldown,
        updateCoolDown,
        clearCoolDown,
    };
};
