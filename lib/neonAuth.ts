import { createClient } from "@neondatabase/neon-js";

// Neon client with integrated authentication
// This connects to your Neon database's auth and data API
export const neonClient = createClient({
    auth: {
        url: import.meta.env.VITE_NEON_AUTH_URL as string,
    },
    dataApi: {
        url: import.meta.env.VITE_NEON_DATA_API_URL as string || "",
    },
});

// Export the auth API for use in components
export const auth = neonClient.auth;
