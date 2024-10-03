/**
 * Page providing a centralized naming convention for frontend routes
 */

const publicBaseUrl = "";
const adminBaseUrl     = "/admin"

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
    alipayAccountsByClientPath                  : `${adminBaseUrl}/alipayaccountsbyclient`,
    bankAccountsPath                            : `${adminBaseUrl}/bankaccounts`,
    bankAccountsByClientPath                    : `${adminBaseUrl}/bankaccountsbyclient`,
    wechatAccountsPath                          : `${adminBaseUrl}/wechataccounts`,
    wechatAccountsByClientPath                  : `${adminBaseUrl}/wechataccountsbyclient`,
    addAlipayAccountPath                        : `${adminBaseUrl}/addalipayaccount`,
    addWechatAccountPath                        : `${adminBaseUrl}/addwechataccount`,
    addBankAccountPath                          : `${adminBaseUrl}/addbankaccount`,
    wechatAccountDetailsPath                    : `${adminBaseUrl}/wechataccountdetails`,
    topUpInstructionsPath                       : `${adminBaseUrl}/topupinstructions`,
    topUpPath                                   : `${adminBaseUrl}/topup`,
    alipayAccountDetailsPath                    : `${adminBaseUrl}/alipayaccountdetails`,
    bankAccountDetailsPath                      : `${adminBaseUrl}/bankaccountdetails`,
    transferRequestsPath                        : `${adminBaseUrl}/transferrequests`,
    transferRequestsByClientPath                : `${adminBaseUrl}/transferrequestsbyclient`,
    transferRequestDetailsPath                  : `${adminBaseUrl}/transferrequestdetails`,
    applyForTransferPath                        : `${adminBaseUrl}/applyfortransfer`,
    approvedTransfersPath                        : `${adminBaseUrl}/approvedtransfers`,
    settledTransfersPath                        : `${adminBaseUrl}/settledtransfers`,
}
