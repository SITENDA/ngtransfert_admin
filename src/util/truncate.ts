export function truncate(text: string, max = 20) {
    if (!text) return "";
    return text.length > max ? `${text.slice(0, max)}…` : text;
}
