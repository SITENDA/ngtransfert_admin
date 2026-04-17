//  src/lib/getBackEndApiUrl.ts

export default function getBackEndApiUrl() {
    if (process.env.NODE_ENV === "production") {
        return process.env.BACKEND_API_BASE_URL!;
    }
    return process.env.BACKEND_API_BASE_URL || "http://localhost:8080";
}