import { useRouter as useNextRouter } from "@/i18n/navigation";
import {generalPaths} from "@/util/frontend-paths";

export function useResetPasswordRouter() {
    const router = useNextRouter();
    return {
        backToLogin: () => router.push(generalPaths.loginPath),
    };
}
