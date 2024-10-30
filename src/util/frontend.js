/**
 * Page providing a centralized naming convention for frontend routes
 */

const publicBaseUrl = "";
const adminBaseUrl     = "/admin"

export const publicPaths = {
    adminPath                   : `${publicBaseUrl}`,
    loginPath                   : `${publicBaseUrl}/login`,
    unauthorizedPath            : `${publicBaseUrl}/unauthorized`,
}

export const adminPaths = {
    homePath                                    : `${adminBaseUrl}`,
    registerPath                                : `${adminBaseUrl}/register`,
    unauthorizedPath                            : `${adminBaseUrl}/unauthorized`,
    registrationSuccessPath                     : `${adminBaseUrl}/registrationsuccess`,
    verificationSuccessPath                     : `${adminBaseUrl}/verificationsuccess`,
    accountInactivePath                         : `${adminBaseUrl}/accountinactive`,
    receiverAccountsPath                        : `${adminBaseUrl}/receiveraccounts`,
    receiverAccountsByClientPath                  : `${adminBaseUrl}/receiveraccountsbyclient`,
    bankAccountsPath                            : `${adminBaseUrl}/bankaccounts`,
    bankAccountsByClientPath                    : `${adminBaseUrl}/bankaccountsbyclient`,
    wechatAccountsPath                          : `${adminBaseUrl}/wechataccounts`,
    wechatAccountsByClientPath                  : `${adminBaseUrl}/wechataccountsbyclient`,
    addReceiverAccountPath                        : `${adminBaseUrl}/addreceiveraccount`,
    addWechatAccountPath                        : `${adminBaseUrl}/addwechataccount`,
    addBankAccountPath                          : `${adminBaseUrl}/addbankaccount`,
    wechatAccountDetailsPath                    : `${adminBaseUrl}/wechataccountdetails`,
    topUpInstructionsPath                       : `${adminBaseUrl}/topupinstructions`,
    topUpPath                                   : `${adminBaseUrl}/topup`,
    receiverAccountDetailsPath                    : `${adminBaseUrl}/receiveraccountdetails`,
    bankAccountDetailsPath                      : `${adminBaseUrl}/bankaccountdetails`,
    transferRequestsPath                        : `${adminBaseUrl}/transferrequests`,
    transferRequestsByClientPath                : `${adminBaseUrl}/transferrequestsbyclient`,
    transferRequestDetailsPath                  : `${adminBaseUrl}/transferrequestdetails`,
    applyForTransferPath                        : `${adminBaseUrl}/applyfortransfer`,
    approvedTransfersPath                        : `${adminBaseUrl}/approvedtransfers`,
    settledTransfersPath                        : `${adminBaseUrl}/settledtransfers`,
}
