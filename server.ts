// server.ts
import https from "https";
import next from "next";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, "frontend-key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "frontend-cert.pem")),
};

app.prepare().then(() => {
    https.createServer(httpsOptions, async (req, res) => {
        // ✅ Optional: inspect URL safely (no deprecation warning)
        // const url = new URL(req.url ?? "/", `https://${req.headers.host}`);

        // ✅ LET NEXT HANDLE ROUTING
        await handle(req, res);
    }).listen(3000, () => {
        console.log("🚀 HTTPS Next.js running on https://localhost:3000");
    });
});
