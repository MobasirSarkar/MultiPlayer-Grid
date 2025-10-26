import { v4 as uuidV4 } from "uuid";
export const getSessionId = (): string => {
    let sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
        sessionId = uuidV4();
        sessionStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
};
