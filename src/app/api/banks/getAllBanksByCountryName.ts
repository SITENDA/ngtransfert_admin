// pages/api/banks/getAllBanksByCountryName.ts
import { NextApiRequest, NextApiResponse } from "next";
import httpProxyMiddleware from "next-http-proxy-middleware";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        await httpProxyMiddleware(req, res, {
            target: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080",
            pathRewrite: [
                {
                    patternStr: "^/api/banks/getAllBanksByCountryName",
                    replaceStr: "/kaasitoma/banks/getAllBanksByCountryName",
                },
            ],
            changeOrigin: true,
        });
    } catch (err) {
        console.error("Proxy error for get all banks:", err);

        if (!res.headersSent) {
            res.status(500).json({
                status: 500,
                message: "Internal server error during bank proxy",
            });
        }
    }
}