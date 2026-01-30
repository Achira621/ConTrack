import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Prisma client configuration optimized for serverless
export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        // Connection pool configuration for serverless
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Health check function to verify database connectivity
export async function checkDatabaseConnection(): Promise<{ connected: boolean; error?: string }> {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return { connected: true };
    } catch (error) {
        console.error('Database connection failed:', error);
        return {
            connected: false,
            error: error instanceof Error ? error.message : 'Unknown database error',
        };
    }
}

// Graceful shutdown for serverless
export async function disconnectPrisma() {
    try {
        await prisma.$disconnect();
    } catch (error) {
        console.error('Error disconnecting Prisma:', error);
    }
}

export default prisma;
