import type { NextApiRequest, NextApiResponse } from 'next';
// import prisma from '@/lib/prisma'; // Adjust path if needed

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            // const users = await prisma.user.findMany(); // Fetch all users
            // res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}