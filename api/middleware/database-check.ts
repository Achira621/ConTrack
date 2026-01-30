// Middleware to ensure database is connected before processing any requests
// Add this to your API routes to enforce database connectivity

import { prisma } from '../packages/database';

let isConnected = false;
let lastCheckTime = 0;
const CHECK_INTERVAL = 30000; // 30 seconds

export async function ensureDatabaseConnection(req, res, next) {
    const now = Date.now();

    // Check connection status every 30 seconds
    if (!isConnected || (now - lastCheckTime) > CHECK_INTERVAL) {
        try {
            await prisma.$queryRaw`SELECT 1`;
            isConnected = true;
            lastCheckTime = now;
        } catch (error) {
            isConnected = false;
            console.error('Database connection check failed:', error);

            return res.status(503).json({
                success: false,
                error: 'Database is not available',
                message: 'The service is temporarily unavailable. Please try again later.',
                timestamp: new Date().toISOString()
            });
        }
    }

    // If connected, proceed to the next middleware/handler
    if (typeof next === 'function') {
        next();
    }
}

// Export a function to check connection without middleware
export async function checkDatabaseConnection() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return { connected: true, error: null };
    } catch (error) {
        return {
            connected: false,
            error: error.message,
            code: error.code
        };
    }
}
