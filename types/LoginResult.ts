// types/frontend/login.ts
import {BackendLoginPayload} from "./BackendLoginPayload";

export interface LoginResult {
    success: true;
    user: BackendLoginPayload["user"];
}
