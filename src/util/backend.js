// backend.js
const env                       = "development";
const BACKEND_HOST              = env === "production" ? "back.ngtransfert.org" : "localhost";
const BACKEND_API_NAME          = env === "production" ? "ngtransfert_backend" : "";
const VERSION                   = "v14";
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
const banksBaseUrl                  = `${bottomUrl}/banks`;
const transferRequestsBaseUrl       = `${bottomUrl}/transferRequests`;
const countriesBaseUrl              = `${bottomUrl}/countries`;
const currenciesBaseUrl             = `${bottomUrl}/currencies`;
const cashDepositAddressesBaseUrl   = `${bottomUrl}/cashDepositAddresses`;
const bankDepositAddressesBaseUrl   = `${bottomUrl}/bankDepositAddresses`;
const exchangesBaseUrl              = `${bottomUrl}/exchanges`;
const receiverAccountsBaseUrl       = `${bottomUrl}/receiverAccounts`;
const adminPercentagesBaseUrl       = `${bottomUrl}/adminPercentages`;

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
        getAllUrl                                   : `${exchangesBaseUrl}/getAllExchangeRates`,
        findAllBySourceCurrencyCNYUrl               : `${exchangesBaseUrl}/findAllBySourceCurrencyCNY`,
        doCurrencyExchangeUrl                       : `${exchangesBaseUrl}/doCurrencyExchange`,
        topUpAccountBalanceUrl                      : `${exchangesBaseUrl}/topUpAccountBalance`,
        getRateForCurrencyAndCountryUrl             : `${exchangesBaseUrl}/getRateForCurrencyAndCountry`,
        getAmountInCNYUrl                           : `${exchangesBaseUrl}/getAmountInCNY`,
        getAmountInOtherCurrencyUrl                 : `${exchangesBaseUrl}/getAmountInOtherCurrency`
    },
    adminPercentages: {
        getAllAdminPercentagesUrl                    : `${adminPercentagesBaseUrl}/getAllAdminPercentages`,
    }
};