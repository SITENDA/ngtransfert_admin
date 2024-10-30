import ReceiverAccountIdentifier from "./ReceiverAccountIdentifier";

export const initialUser                = '';
export const initialToken               = '';
export const persistItem                = localStorage.getItem("persist");
export const initialPersist       = typeof(persistItem) === "string" ? JSON.parse(persistItem) : false;
export const initialTitle               = 'NG Transfert';
export const initialSidebarCollapsed   = window.innerWidth < 630;
export const initialNavbarShown        = false;
export const initialIsDarkTheme        = true;
export const darkColor                   = 'rgb(0, 21, 41)';
export const lightColor                  = 'rgb(255, 255, 255)';
export const initialIntroPage            = "LandingPage"
export const allowedRoles               = ["ADMIN"];

export const initialRegistrationInputs = {
    fullName            : '',
    email               : '',
    phoneNumber         : '',
    password            : '',
    confirmPassword     : ''
};

export const initialLoginInputs = {
    email               : '',
    phoneNumber         : '',
    password            : '',
    identifier          : ''
};

export const initialTopUpInputs = {
    topUpMethod             : '',
    currencyId              : null,
    amountInOtherCurrency   : null,
    amountInCNY             : null,
    otherCurrencyCode       : null,
    cnyCurrencyCode         : "CNY",
    countryOfTopUpId        : '',
    proofPicture            : {file: null, url: null},
}


export const initialReceiverAccountInputs = {
    receiverAccountName         : '',
    receiverAccountType         : '',
    clientId                    : null,
    receiverAccountIdentifier   : ReceiverAccountIdentifier.QR_CODE_IMAGE,
    qrCodeImage                 : {file: null, url: null},
    email                       : '',
    phoneNumber                 : '',
    bankAccountNumber           : '',
    bankId                      : '',
    countryId                   : null,
    cardHolderName              : '',
    bankName                    : ''
};

export const initialTransferRequestInputs = {
    currencyId              : null,
    amount                  : null,
    rate                    : null,
    remark                  : '',
    receiverAccountType     : '',
    receiverAccountId       : null,
    clientId                : null,
    countryOfDepositId      : null
}

export const initialWechatAccountInputs = {
    wechatAccountId: null,
    wechatAccountName: '',
    clientId: null,
    email: '',
    phoneNumber: '',
    wechatQrCodeImage: {file: null, url: null} // This will hold the file object for the image
};

export const initialBankAccountInputs = {
    countryId: null,
    bankAccountId: null,
    bankAccountNumber: null,
    bankId : null,
    clientId: null,
    cardHolderName: '',
    bankName: ''
}

export const initialMakePaymentInputs = {
    clientId: null,
    amount: null,
    loanId: null,
}

export const initialValidBankAccount = {
    validCountryId              : false,
    validBankAccountId          : false,
    validBankAccountNumber      : false,
    validBankId                 : false,
    validClientId               : false,
    validCardHolderName         : false,
    validBankName               : false
}

export const initialValidTransferRequest = {
    validCurrencyId              : false,
    validAmount                  : false,
    validRate                    : false,
    validRemark                  : false,
    validReceiverAccountType     : false,
    validReceiverAccountId       : false,
    validClientId                : false,
    validCountryOfDepositId      : false
}

export const initialValidReceiverAccount = {
    validReceiverAccountName        : false,
    validReceiverAccountType        : false,
    validClientId                   : false,
    validReceiverAccountIdentifier  : false,
    validQrCodeImage                : false,
    validEmail                      : false,
    validPhoneNumber                : false,
    validBankAccountNumber          : false,
    validBankId                     : false,
    validCountryId                  : false,
    validCardHolderName             : false,
    validBankName                   : false,
}

export const initialValidWechatAccount = {
    validWechatAccountId            : false,
    validWechatAccountName          : false,
    validEmail                      : false,
    validPhoneNumber                : false,
    validClientId                   : false,
    validWechatAccountIdentifier    : false,
    validWechatQrCodeImage          : false
}

export const initialValidTopUp = {
    validTopUpMethod            : false,
    validCurrencyId             : false,
    validAmountInOtherCurrency  : false,
    validAmountInCNY            : false,
    validCountryOfTopUpId       : false,
    validOtherCurrencyCode      : false,
    validCnyCurrencyCode        : false,
    validProofPicture           : false,
}

export const initialEventProperties = {
    errorMessage        : '',
    isLoading           : false,
    isError             : false,
    isSuccess           : false,
    successMessage      : ''
}

export const initialLoginSpecifics = {
    identifier          : 'email',
    showBeginnerPrompt  : false,
    showPhoneNumber     : false
}

export const initialReceiverAccountSpecifics = {
    identifier          : ReceiverAccountIdentifier.QR_CODE_IMAGE,
    showBeginnerPrompt  : false,
    showPhoneNumber     : false,
    showEmail           : false,
    showQrCodeImage     : false
}

export const initialWechatAccountSpecifics = {
    identifier          : 'qrCodeImage',
    showBeginnerPrompt  : false,
    showPhoneNumber     : false,
    showEmail           : false,
    showQrCodeImage     : false
}

export const initialValidRegistration = {
    validFullName           : false,
    validEmail              : false,
    validPhoneNumber        : false,
    validPassword           : false,
    validConfirmPassword    : false
}

export const initialValidLogin = {
    validEmail              : false,
    validPhoneNumber        : false,
    validPassword           : false,
    validIdentifier         : false
}

export const initialBankAccountFocus = {
    countryIdFocus          : false,
    bankAccountNumberFocus  : false,
    bankFocus               : false,
    cardHolderNameFocus     : false,
    errorFocus              : false,
    bankNameFocus           : false,
}

export const initialTopUpFocus = {
    topUpMethodFocus        : false,
    currencyIdFocus         : null,
    amountInOtherCurrencyFocus       : false,
    amountInCNYFocus        : false,
    countryOfTopUpIdFocus   : false,
    otherCurrencyCodeFocus  : false,
    cnyCurrencyCodeFocus    : false,
    proofPictureFocus       : false,
}

export const initialTransferRequestFocus = {
    currencyIdFocus              : false,
    amountFocus                  : false,
    rateFocus                    : false,
    remarkFocus                  : false,
    receiverAccountTypeFocus     : false,
    clientIdFocus                : false,
    countryOfDepositIdFocus      : false
}

export const initialRegistrationFocus = {
    fullNameFocus           : false,
    emailFocus              : false,
    phoneNumberFocus        : false,
    passwordFocus           : false,
    confirmPasswordFocus    : false,
    errorFocus              : false
}

export const initialLoginFocus = {
    emailFocus              : false,
    phoneNumberFocus        : false,
    passwordFocus           : false,
    errorFocus              : false
}

export const initialReceiverAccountFocus = {
    receiverAccountNameFocus        : false,
    receiverAccountTypeFocus        : false,
    clientIdFocus                   : false,
    receiverAccountIdentifierFocus  : false,
    qrCodeImageFocus                : false,
    emailFocus                      : false,
    phoneNumberFocus                : false,
    bankAccountNumberFocus          : false,
    bankIdFocus                     : false,
    countryIdFocus                  : false,
    cardHolderNameFocus             : false,
    bankNameFocus                   : false

}

export const initialWechatAccountFocus = {
    wechatAccountIdFocus            : false,
    wechatAccountNameFocus          : false,
    clientIdFocus                   : false,
    emailFocus                      : false,
    phoneNumberFocus                : false,
    passwordFocus                   : false,
    wechatQrCodeImageFocus          : false,
    wechatAccountIdentifierFocus    : false
}

export const initials = {
    initialUser,
    initialToken,
    initialPersist,
    initialTitle,
    initialSidebarCollapsed,
    initialLoginSpecifics,
    initialEventProperties,
    initialRegistrationInputs,
    initialRegistrationFocus,
    initialIsDarkTheme,
    initialReceiverAccountFocus,
    initialLoginInputs,
    initialValidRegistration
}

export const initialState =  {
    user                        : initialUser,
    token                       : initialToken,
    persist                     : initialPersist,
    title                       : initialTitle,
    sidebarCollapsed            : initialSidebarCollapsed,
    navbarShown                 : initialNavbarShown,
    loginSpecifics              : initialLoginSpecifics,
    eventProperties             : initialEventProperties,
    registrationInputs          : initialRegistrationInputs,
    receiverAccountInputs       : initialReceiverAccountInputs,
    wechatAccountInputs         : initialWechatAccountInputs,
    bankAccountInputs           : initialBankAccountInputs,
    makePaymentInputs           : initialMakePaymentInputs,
    transferRequestInputs       : initialTransferRequestInputs,
    loginInputs                 : initialLoginInputs,
    topUpInputs                 : initialTopUpInputs,
    registrationFocus           : initialRegistrationFocus,
    isDarkTheme                 : initialIsDarkTheme,
    darkColor,
    lightColor,
    introPage                   : initialIntroPage,
    validReceiverAccount        : initialValidReceiverAccount,
    validWechatAccount          : initialValidWechatAccount,
    validBankAccount            : initialValidBankAccount,
    validTopUp                  : initialValidTopUp,
    receiverAccountFocus        : initialReceiverAccountFocus,
    wechatAccountFocus          : initialWechatAccountFocus,
    bankAccountFocus            : initialBankAccountFocus,
    topUpFocus                  : initialTopUpFocus,
    receiverAccountSpecifics    : initialReceiverAccountSpecifics,
    wechatAccountSpecifics      : initialWechatAccountSpecifics,
    validRegistration           : initialValidRegistration,
    validLogin                  : initialValidLogin,
    validTransferRequest        : initialValidTransferRequest,
    loginFocus                  : initialLoginFocus,
    transferRequestFocus        : initialTransferRequestFocus
}

export default initials