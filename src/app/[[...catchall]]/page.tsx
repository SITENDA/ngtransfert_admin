// src/app/[[...catchall]]/page.tsx
import { redirect } from "next/navigation";

export default function CatchAllPage() {
    // Always redirect to the default locale
    redirect("/en/login");
}
