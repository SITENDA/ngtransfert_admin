// pages/api/auth/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    await httpProxyMiddleware(req, res, {
        target: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080',
        pathRewrite: {
            '^/api/auth/register': '/auth/register',
        },
        changeOrigin: true,
        onError: (err, req, res) => {
            console.error('Proxy error for register:', err);
            if (!res.headersSent) {
                res.status(500).json({ status: 500, message: 'Internal server error during register proxy' });
            }
        },
    });
};