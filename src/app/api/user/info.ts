// pages/api/user/info.ts
import { NextApiRequest, NextApiResponse } from "next";
import httpProxyMiddleware from "next-http-proxy-middleware";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        await httpProxyMiddleware(req, res, {
            target: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080",
            pathRewrite: {
                "^/api/user/info(.*)$": "/kaasitoma/users/getUserByIdentifier$1",
            },
            changeOrigin: true,
        });
    } catch (err) {
        console.error("Proxy error for user info:", err);

        if (!res.headersSent) {
            return res.status(500).json({
                status: 500,
                message: "Internal server error during user info proxy",
            });
        }
    }
}