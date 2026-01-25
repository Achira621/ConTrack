import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    try {
        if (req.method === 'POST') {
            // Simple login - find or create user
            const { email, role } = req.body;

            if (!email || !role) {
                return res.status(400).json({ error: 'Email and role are required' });
            }

            const user = await prisma.user.upsert({
                where: { email },
                create: {
                    email,
                    role,
                    name: email.split('@')[0],
                },
                update: {}, // Don't update on subsequent logins
            });

            return res.status(200).json({
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            });
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Auth Error:', error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Internal server error',
        });
    }
}
