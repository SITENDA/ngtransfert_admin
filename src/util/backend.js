// backend.js
const env                       = "production";
const BACKEND_HOST              = env === "production" ? "back.ngtransfert.org" : "localhost";
const BACKEND_API_NAME          = env === "production" ? "ngtransfert_backend" : "";
const VERSION                   = "v12";
const PROTOCOL                  = env === "production" ? "https" : "http";

const baseUrl                   = env === "production" ? `${PROTOCOL}://${BACKEND_HOST}/${BACKEND_API_NAME}/${VERSION}`
    : "http://localhost:8080";

const bottomUrl                     = "/nnyinimu";
const free_access                   = "/auth";
const registerUrl                   = `${free_access}/register`;
const loginUrl                      = `${free_access}/signin`;
const contactUrl                    = `${free_access}/contact`;
const logoutUrl                     = `${free_access}/signout`;
const refreshUrl                    = `${free_access}/refresh`;
const imagesUrl                     = env === "production" ? 'https://admin.ngtransfert.org/images/' : 'http://localhost:8080/auth/images/';
const avatarUrl                     = `${free_access}/avatars`;
const checkAccountStatusUrl         = `${free_access}/checkVerificationStatus`;
const resendVerificationUrl         = `${free_access}/resendVerificationLink`;
const usersBaseUrl                  = `${bottomUrl}/users`;
const rolesBaseUrl                  = `${bottomUrl}/roles`;
const alipayAccountsBaseUrl         = `${bottomUrl}/alipayAccounts`;
const wechatAccountsBaseUrl         = `${bottomUrl}/wechatAccounts`;
const bankAccountsBaseUrl           = `${bottomUrl}/bankAccounts`;
const banksBaseUrl                  = `${bottomUrl}/banks`;
const transferRequestsBaseUrl       = `${bottomUrl}/transferRequests`;
const countriesBaseUrl              = `${bottomUrl}/countries`;
const currenciesBaseUrl             = `${bottomUrl}/currencies`;
const cashDepositAddressesBaseUrl   = `${bottomUrl}/cashDepositAddresses`;
const bankDepositAddressesBaseUrl   = `${bottomUrl}/bankDepositAddresses`;
const exchangesBaseUrl              = `${bottomUrl}/exchanges`;
const receiverAccountsBaseUrl       = `${bottomUrl}/receiverAccounts`;

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
        getAllUrl               : `${usersBaseUrl}/getAllUsers`,
        getAllClientsUrl        : `${usersBaseUrl}/getAllClients`,
        getByIdUrl              : `${usersBaseUrl}/getUserById`,
        getByUserIdUrl          : `${usersBaseUrl}/getByUserId`,
        deleteUrl               : `${usersBaseUrl}/deleteUser`,
    },
    receiverAccounts: {
        createAccountUrl        : `${receiverAccountsBaseUrl}/createReceiverAccount`,
        getAllUrl               : `${receiverAccountsBaseUrl}/getAllReceiverAccounts`,
        getAllByClientIdUrl     : `${receiverAccountsBaseUrl}/getReceiverAccountsForClient`,
        getByIdUrl              : `${receiverAccountsBaseUrl}/getReceiverAccountByReceiverAccountId`,
        deleteUrl               : `${receiverAccountsBaseUrl}/deleteReceiverAccount`,
    },

    alipayAccounts: {
        createAccountUrl        : `${alipayAccountsBaseUrl}/createAlipayAccount`,
        getAllUrl               : `${alipayAccountsBaseUrl}/getAllAlipayAccounts`,
        getAllByClientIdUrl     : `${alipayAccountsBaseUrl}/getAlipayAccountsForClient`,
        getByIdUrl              : `${alipayAccountsBaseUrl}/getAlipayAccountByAlipayAccountId`,
        deleteUrl               : `${alipayAccountsBaseUrl}/deleteAlipayAccount`,
    },
    wechatAccounts: {
        createAccountUrl        : `${wechatAccountsBaseUrl}/createWechatAccount`,
        getAllUrl               : `${wechatAccountsBaseUrl}/getAllWechatAccounts`,
        getAllByClientIdUrl     : `${wechatAccountsBaseUrl}/getWechatAccountsForClient`,
        getByIdUrl              : `${wechatAccountsBaseUrl}/getWechatAccountByWechatAccountId`,
        deleteUrl               : `${wechatAccountsBaseUrl}/deleteWechatAccount`,
    },
    bankAccounts: {
        createAccountUrl        : `${bankAccountsBaseUrl}/createBankAccount`,
        getAllUrl               : `${bankAccountsBaseUrl}/getAllBankAccounts`,
        getAllByClientIdUrl     : `${bankAccountsBaseUrl}/getBankAccountsForClient`,
        getByIdUrl              : `${bankAccountsBaseUrl}/getBankAccountByBankAccountId`,
        deleteUrl               : `${bankAccountsBaseUrl}/deleteBankAccount`,

    },
    banks: {
        createBankUrl           : `${banksBaseUrl}/createBank`,
        getAllByCountryUrl      : `${banksBaseUrl}/getAllBanksInCountry`,
        getAllByCountryNameUrl  : `${banksBaseUrl}/getAllBanksByCountryName`,
        getAllUrl               : `${banksBaseUrl}/getAllBanks`,
        getByIdUrl              : `${banksBaseUrl}/getBankById`,
    },
    transferRequests: {
        createRequestUrl        : `${transferRequestsBaseUrl}/createTransferRequest`,
        getAllUrl               : `${transferRequestsBaseUrl}/getAllTransferRequests`,
        getAllByClientIdUrl     : `${transferRequestsBaseUrl}/getTransferRequestsForClient`,
        getByIdUrl              : `${transferRequestsBaseUrl}/getTransferRequestByTransferRequestId`,
        deleteUrl               : `${transferRequestsBaseUrl}/deleteTransferRequest`,
    },
    countries: {
        getAllUrl               : `${countriesBaseUrl}/getAllCountries`,
        getPriorityCountriesUrl : `${countriesBaseUrl}/getPriorityCountries`,
        getByIdUrl              : `${countriesBaseUrl}/getCountryByCountryId`,
        getByCountryNameUrl     : `${countriesBaseUrl}/getCountryByCountryName`,
    },
    currencies: {
        getAllUrl                   : `${currenciesBaseUrl}/getAllCurrencies`,
        getPriorityCurrenciesUrl    : `${currenciesBaseUrl}/getPriorityCurrencies`,
        getCurrenciesForCountryUrl  : `${currenciesBaseUrl}/getCurrenciesForCountry`,
        getByIdUrl                  : `${currenciesBaseUrl}/getCurrencyById`,
    },
    cashDepositAddresses: {
        getCashDepositAddressesByCountryNameUrl     : `${cashDepositAddressesBaseUrl}/getCashDepositAddressesByCountryName`,
        getCashDepositAddressesByCountryIdUrl       : `${cashDepositAddressesBaseUrl}/getCashDepositAddressesByCountryId`,
        createCashDepositAddressUrl                 : `${cashDepositAddressesBaseUrl}/createCashDepositAddress}`,
        deleteUrl                                   : `${cashDepositAddressesBaseUrl}/deleteCashDepositAddress}`,
    },
    bankDepositAddresses: {
        getBankDepositAddressesByCountryNameUrl     : `${bankDepositAddressesBaseUrl}/getBankDepositAddressesByCountryName`,
        getBankDepositAddressesByCountryIdUrl       : `${bankDepositAddressesBaseUrl}/getBankDepositAddressesByCountryId`,
        createBankDepositAddressUrl                 : `${bankDepositAddressesBaseUrl}/createBankDepositAddress}`,
        deleteUrl                                   : `${bankDepositAddressesBaseUrl}/deleteBankDepositAddress}`,
    },
    exchanges : {
        doCurrencyExchangeUrl                       : `${exchangesBaseUrl}/doCurrencyExchange`,
        topUpAccountBalanceUrl                      : `${exchangesBaseUrl}/topUpAccountBalance`,
        getRateForCurrencyAndCountryUrl             : `${exchangesBaseUrl}/getRateForCurrencyAndCountry`,
        getAmountInCNYUrl                           : `${exchangesBaseUrl}/getAmountInCNY`,
        getAmountInTargetCurrencyUrl                           : `${exchangesBaseUrl}/getAmountInTargetCurrency`
    }
};