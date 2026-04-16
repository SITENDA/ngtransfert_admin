// src/lib/sessionConfig.ts

/**
 * Centralized session & token behavior configuration
 * Used by both request-time validation and background cleanup
 */
export const SESSION_CONFIG = {
    /**
     * Access token lifetime (from backend)
     * Example: 1 hour
     */
    ACCESS_TOKEN_TTL_MS: 60 * 60 * 1000,

    /**
     * How close to expiry we proactively refresh the token
     * Example: refresh if < 5 minutes left
     */
    // REFRESH_WINDOW_MS: 5 * 60 * 1000,
    // 🔥 TEST MODE values
    REFRESH_WINDOW_MS: 5 * 1000, // refresh when < 5s left

    /**
     * Hard idle timeout.
     * If the user has NO activity beyond this, session is destroyed.
     * Example: 1 hour inactivity
     */
    IDLE_TIMEOUT_MS: 60 * 60 * 1000,

};
