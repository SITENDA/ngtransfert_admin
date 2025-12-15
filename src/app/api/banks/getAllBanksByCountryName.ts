// pages/api/banks/getAllBanksByCountryName.ts
import { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    await httpProxyMiddleware(req, res, {
        // This is the target URL of your Spring Boot backend
        target: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080',
        // This rewrites the URL path:
        // It takes the incoming '/api/banks/getAllBanksByCountryName' request from Next.js
        // and changes it to '/kaasitoma/banks/getAllBanksByCountryName' before forwarding to the target.
        pathRewrite: [
            {
                pattern: '^/api/banks/getAllBanksByCountryName',
                // Keep the query parameters (`?countryName=China`) when rewriting the path
                // The regex here will capture the base path and replace it correctly
                replace: '/kaasitoma/banks/getAllBanksByCountryName',
            },
        ],
        // Important: Change this to 'true' if your frontend and backend are on different domains/ports.
        changeOrigin: true,
        // Optional: Add error handling for proxy failures
        onError: (err, req, res) => {
            console.error('Proxy error for get all banks:', err);
            if (!res.headersSent) {
                res.status(500).json({ status: 500, message: 'Internal server error during bank proxy' });
            }
        },
    });
};