// backend.js
const env               = "development";
const BACKEND_HOST      = env === "production" ? "back.ngtransfert.org" : "localhost";
const BACKEND_API_NAME  = env === "production" ? "ngtransfert_backend" : "";
const VERSION           = "v5";
const PROTOCOL          = env === "production" ? "https" : "http";

const baseUrl = env === "production" ? `${PROTOCOL}://${BACKEND_HOST}/${BACKEND_API_NAME}/${VERSION}`
: "http://localhost:8080";

const bottomUrl                 = "/kaasitoma";
const free_access               = "/auth";
const registerUrl               = `${free_access}/register`;
const loginUrl                  = `${free_access}/signin`;
const contactUrl                = `${free_access}/contact`;
const logoutUrl                 = `${free_access}/signout`;
const refreshUrl                = `${free_access}/refresh`;
const imagesUrl                 = env === "production" ? 'https://admin.ngtransfert.org/images/' : 'http://localhost:8080/auth/images?relativePath=';
const avatarUrl                 = `${free_access}/avatars`;
const checkAccountStatusUrl     = `${free_access}/checkVerificationStatus`;
const resendVerificationUrl     = `${free_access}/resendVerificationLink`;
const usersBaseUrl              = `${bottomUrl}/users`;
const rolesBaseUrl              = `${bottomUrl}/roles`;


export const backend = {
    baseUrl,
    free_access,
    imagesUrl,
    env,
    registerUrl,
    loginUrl,
    contactUrl,
    logoutUrl,
    refreshUrl,
    avatarUrl,
    usersBaseUrl,
    rolesBaseUrl,
    checkAccountStatusUrl,
    resendVerificationUrl,
    users: {
        getAllUrl                  : `${usersBaseUrl}/getAllUsers`,
        getAllClientsUrl           : `${usersBaseUrl}/getAllClients`,
        getByIdUrl                 : `${usersBaseUrl}/getUserById`,
        getByUserIdUrl             : `${usersBaseUrl}/getByUserId`,
        deleteUrl              : `${usersBaseUrl}/deleteUser`,
    },
    alipayAccounts: {
        createAccountUrl           : `${bottomUrl}/createAlipayAccount`,
        getAllUrl                  : `${bottomUrl}/getAllAlipayAccounts`,
        getAllByClientIdUrl        : `${bottomUrl}/getAlipayAccountsForClient`,
        getByIdUrl                 : `${bottomUrl}/getAlipayAccountByAlipayAccountId`,
        deleteUrl                 : `${bottomUrl}/deleteAlipayAccount`,
    },
    wechatAccounts: {
        createAccountUrl           : `${bottomUrl}/createWechatAccount`,
        getAllUrl                  : `${bottomUrl}/getAllWechatAccounts`,
        getAllByClientIdUrl        : `${bottomUrl}/getWechatAccountsForClient`,
        getByIdUrl                 : `${bottomUrl}/getWechatAccountByWechatAccountId`,
        deleteUrl                 : `${bottomUrl}/deleteWechatAccount`,
    },
    bankAccounts: {
        createAccountUrl           : `${bottomUrl}/createBankAccount`,
        getAllUrl                 : `${bottomUrl}/getAllBankAccounts`,
        getAllByClientIdUrl        : `${bottomUrl}/getBankAccountsForClient`,
        getByIdUrl                 : `${bottomUrl}/getBankAccountByBankAccountId`,
        deleteUrl                 : `${bottomUrl}/deleteBankAccount`,

    },
    banks: {
        getAllByCountryUrl          : `${bottomUrl}/getAllBanksInCountry`,
        getAllUrl                   : `${bottomUrl}/getAllBanks`,
        getByIdUrl                  : `${bottomUrl}/getBankById`,
    }
};