import {User} from "next-auth";

export interface RefreshApiResponse {
    success: boolean;
    tokens: {
        timeStamp: string;
        statusCode: number;
        status: string;
        message: string;
        developerMessage: string | null;
        path: string | null;
        requestMethod: string | null;
        data: {
            token: string;
            user: User;
        };
    };
};
