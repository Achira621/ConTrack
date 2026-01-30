import type { VercelRequest, VercelResponse } from '@vercel/node';
import { checkDatabaseConnection } from '../lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Set JSON content type
    res.setHeader('Content-Type', 'application/json');

    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed',
        });
    }

    try {
        // Check environment variables
        const hasDbUrl = !!process.env.DATABASE_URL;

        // Check Prisma client
        let prismaClientAvailable = false;
        try {
            // Try to import Prisma client
            const { PrismaClient } = await import('@prisma/client');
            prismaClientAvailable = !!PrismaClient;
        } catch (error) {
            console.error('Prisma client import failed:', error);
        }

        // Check database connection
        const dbStatus = await checkDatabaseConnection();

        const health = {
            status: dbStatus.connected ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString(),
            checks: {
                environment: {
                    nodeEnv: process.env.NODE_ENV || 'unknown',
                    hasDbUrl,
                },
                prisma: {
                    clientAvailable: prismaClientAvailable,
                },
                database: {
                    connected: dbStatus.connected,
                    error: dbStatus.error,
                },
            },
        };

        if (!dbStatus.connected) {
            return res.status(503).json({
                success: false,
                ...health,
            });
        }

        return res.status(200).json({
            success: true,
            ...health,
        });
    } catch (error) {
        console.error('Health check error:', error);
        return res.status(500).json({
            success: false,
            status: 'error',
            error: error instanceof Error ? error.message : 'Health check failed',
            timestamp: new Date().toISOString(),
        });
    }
}
