import { createNeonJsClient } from "@neondatabase/neon-js";

export const neonClient = createNeonJsClient({
    url: import.meta.env.VITE_NEON_AUTH_URL,
});
