/**
 * Page providing a centralized naming convention for frontend routes
 */

const publicBaseUrl = "/admin";
const adminBaseUrl     = ""

export const publicPaths = {
    adminPath                   : `${publicBaseUrl}`,
    loginPath                   : `${publicBaseUrl}/login`,
    registerPath                : `${publicBaseUrl}/register`,
    unauthorizedPath            : `${publicBaseUrl}/unauthorized`,
}

export const adminPaths = {
    homePath                                    : `${adminBaseUrl}`,
    loginPath                                   : `${adminBaseUrl}/login`,
    registerPath                                : `${adminBaseUrl}/register`,
    unauthorizedPath                            : `${adminBaseUrl}/unauthorized`,
    registrationSuccessPath                     : `${adminBaseUrl}/registrationsuccess`,
    verificationSuccessPath                     : `${adminBaseUrl}/verificationsuccess`,
    accountInactivePath                         : `${adminBaseUrl}/accountinactive`,
    alipayAccountsPath                          : `${adminBaseUrl}/alipayaccounts`,
    bankAccountsPath                            : `${adminBaseUrl}/bankaccounts`,
    wechatAccountsPath                          : `${adminBaseUrl}/wechataccounts`,
    addAlipayAccountPath                        : `${adminBaseUrl}/addalipayaccount`,
    addWechatAccountPath                        : `${adminBaseUrl}/addwechataccount`,
    addBankAccountPath                          : `${adminBaseUrl}/addbankaccount`,
    wechatAccountDetailsPath                    : `${adminBaseUrl}/wechataccountdetails`,
    topUpPath                                   : `${adminBaseUrl}/topup`,
    alipayAccountDetailsPath                    : `${adminBaseUrl}/alipayaccountdetails`,
    bankAccountDetailsPath                      : `${adminBaseUrl}/bankaccountdetails`,
    transferRequestsPath                        : `${adminBaseUrl}/transferrequests`,
    transferRequestDetailsPath                  : `${adminBaseUrl}/transferrequestdetails`,
    applyForTransferPath                        : `${adminBaseUrl}/applyfortransfer`,
}
