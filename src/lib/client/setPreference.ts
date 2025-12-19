import {SetPreferencePayload} from "../../../types/SetPreferencePayload";

export async function setPreference(payload: SetPreferencePayload) {
    try {
        await fetch("/api/auth/preferences", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error("Failed to set preference", error);
    }
}
