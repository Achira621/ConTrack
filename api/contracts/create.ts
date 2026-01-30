// Updated create contract endpoint with database health check
import { createContract } from '../packages/contracts';
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

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Use database check middleware
    await ensureDatabaseConnection(req, res, async () => {
        try {
            const contractData = req.body;

            // Validate required fields
            if (!contractData.title || !contractData.clientId || !contractData.vendorId || !contractData.amount) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: title, clientId, vendorId, amount'
                });
            }

            // Create contract using the backend package
            const result = await createContract(contractData);

            if (result.success) {
                return res.status(201).json(result);
            } else {
                return res.status(400).json(result);
            }
        } catch (error) {
            console.error('Error creating contract:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Failed to create contract',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    });
}
