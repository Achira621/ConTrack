// Updated contracts endpoint with database health check
import { prisma } from '../packages/database';
import { ensureDatabaseConnection } from './middleware/database-check';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Use database check middleware
    await ensureDatabaseConnection(req, res, async () => {
        try {
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).json({ error: 'userId is required' });
            }

            // Fetch contracts where user is either client or vendor
            const contracts = await prisma.contract.findMany({
                where: {
                    OR: [
                        { clientId: userId },
                        { vendorId: userId }
                    ]
                },
                include: {
                    client: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true
                        }
                    },
                    vendor: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true
                        }
                    },
                    payments: {
                        select: {
                            id: true,
                            amount: true,
                            status: true,
                            paidAt: true
                        }
                    },
                    paymentSchedules: {
                        select: {
                            id: true,
                            milestoneName: true,
                            amount: true,
                            percentage: true,
                            dueDate: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return res.status(200).json({
                success: true,
                contracts,
                count: contracts.length
            });
        } catch (error) {
            console.error('Error fetching contracts:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch contracts',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    });
}
