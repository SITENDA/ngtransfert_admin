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
            user: {
                userId: number;
                fullName: string;
                username: string;
                email: string;
                registrationDate: number;
                profileImageUrl: string;
                ekiddako: string;
            };
        };
    };
};
