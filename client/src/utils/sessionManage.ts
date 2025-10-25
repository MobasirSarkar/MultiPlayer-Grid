import { v4 as uuidV4 } from "uuid";
export const getSessionId = (): string => {
    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
        sessionId = uuidV4();
        localStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
};
