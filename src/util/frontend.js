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
    homePath                                : adminBaseUrl,
    registerPath                            : `${adminBaseUrl}/register`,
    registrationSuccessPath                 : `${adminBaseUrl}/registrationsuccess`,
    requestLoanPath                         : `${adminBaseUrl}/requestloan`,
    loanDetailsPath                         : `${adminBaseUrl}/loandetails`,
    currentLoansListPath                    : `${adminBaseUrl}/currentloanslist`,
    settledLoansListPath                    : `${adminBaseUrl}/settledloanslist`,
    loanRequestSubmittedPath                : `${adminBaseUrl}/loanrequestsubmitted`,
    moreInputsPath                          : `${adminBaseUrl}/moreinputs`,
    loansByClientPath                       : `${adminBaseUrl}/loansbyclient`,
    loanRequestsPath                        : `${adminBaseUrl}/loanrequests`,
    clientDetailsPath                       : `${adminBaseUrl}/clientdetails`,
    makePaymentPath                         : `${adminBaseUrl}/makepayment`,
    paymentsListPath                        : `${adminBaseUrl}/paymentslist`,
    paymentsByLoanPath                      : `${adminBaseUrl}/paymentsbyloan`,
    paymentDetailsPath                      : `${adminBaseUrl}/paymentdetails`,
    loanRequestDetailsPath                  : `${adminBaseUrl}/loanrequestdetails`,
    approveLoanRequestPath                  : `${adminBaseUrl}/approveloanrequest`,
    ClientsListPath                         : `${adminBaseUrl}/clients`,
}
