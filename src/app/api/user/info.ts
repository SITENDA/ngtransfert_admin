// pages/api/user/info.ts - ADJUSTED for @RequestParam in Spring Boot
import { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    await httpProxyMiddleware(req, res, {
        target: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080',
        // The path now needs to be '/kaasitoma/users/getUserByIdentifier'
        // and the query parameters will be automatically forwarded by next-http-proxy-middleware
        // if they are present in the incoming req.url
        pathRewrite: {
            '^/api/user/info(.*)$': '/kaasitoma/users/getUserByIdentifier$1',
            // This regex captures any query parameters from /api/user/info?key=value
            // and appends them to /kaasitoma/users/getUserByIdentifier
        },
        changeOrigin: true,
        onError: (err, req, res) => {
            console.error('Proxy error for user info:', err);
            if (!res.headersSent) {
                res.status(500).json({ status: 500, message: 'Internal server error during user info proxy' });
            }
        },
    });
};