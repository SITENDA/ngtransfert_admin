// pages/api/auth/signin.ts
import { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    await httpProxyMiddleware(req, res, {
        // This is the target URL of your Spring Boot backend
        target: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080',
        // This rewrites the URL path:
        // It takes the incoming '/api/auth/signin' request from Next.js
        // and changes it to '/auth/signin' before forwarding to the target.
        pathRewrite: {
            '^/api/auth/signin': '/auth/signin',
        },
        // Important: Change this to 'true' if your frontend and backend are on different domains/ports.
        // This is usually the case during development (e.g., 3000 vs 8080).
        changeOrigin: true,
        // Optional: Add error handling for proxy failures
        onError: (err, req, res) => {
            console.error('Proxy error for signin:', err);
            // Respond to the client with a 500 Internal Server Error
            if (!res.headersSent) {
                res.status(500).json({ status: 500, message: 'Internal server error during signin proxy' });
            }
        },
    });
};