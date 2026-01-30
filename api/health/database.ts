// Database Health Check API Endpoint
// GET /api/health/database
// Returns 200 if database is connected, 503 if not

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../packages/database';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const startTime = Date.now();

    try {
        // Test 1: Check if Prisma client is initialized
        if (!prisma) {
            return res.status(503).json({
                success: false,
                status: 'error',
                error: 'Prisma client is not initialized',
                timestamp: new Date().toISOString()
            });
        }

        // Test 2: Execute a simple query to verify connection
        await prisma.$queryRaw`SELECT 1 as result`;

        // Test 3: Check if we can query the User table
        const userCount = await prisma.user.count();

        // Test 4: Check if we can query the Contract table
        const contractCount = await prisma.contract.count();

        const responseTime = Date.now() - startTime;

        return res.status(200).json({
            success: true,
            status: 'healthy',
            message: 'Database connection is working',
            data: {
                connected: true,
                responseTime: `${responseTime}ms`,
                database: {
                    users: userCount,
                    contracts: contractCount
                }
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        const responseTime = Date.now() - startTime;

        console.error('Database health check failed:', error);

        // Type guard to safely access error properties
        const errorMessage = error instanceof Error ? error.message : 'Database connection failed';
        const errorType = error instanceof Error ? error.constructor.name : 'Unknown';
        const errorCode = (error as any)?.code;
        const errorMeta = (error as any)?.meta;

        return res.status(503).json({
            success: false,
            status: 'unhealthy',
            error: errorMessage,
            details: {
                responseTime: `${responseTime}ms`,
                errorType: errorType,
                code: errorCode,
                meta: errorMeta
            },
            timestamp: new Date().toISOString()
        });
    } finally {
        // Don't disconnect - let Prisma manage connections
    }
}
