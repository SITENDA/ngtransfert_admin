//  src/util/buildImageUrl.ts

type ImageCategory =
    | "profile_pictures"
    | "proof_pictures"
    | "receiver_qr_codes";

const FALLBACKS: Record<ImageCategory, string> = {
    profile_pictures: "default-pic.png",
    proof_pictures: "default-proof.png",
    receiver_qr_codes: "default-qr.png",
};

function normalizePart(value: string): string {
    return value.replace(/^\/+|\/+$/g, "");
}

export function buildImageUrl(
    fileName?: string | null,
    category: ImageCategory = "profile_pictures"
): string {
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || (process.env.NODE_ENV === "production" ? "https://back.ngtransfert.com/images" : "http://localhost:8081/images");

    const safeBase = baseUrl.replace(/\/+$/g, "");
    const safeCategory = normalizePart(category);
    const safeFile = normalizePart(fileName?.trim() || FALLBACKS[category]);

    return `${safeBase}/${safeCategory}/${safeFile}`;
}