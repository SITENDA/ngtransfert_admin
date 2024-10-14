import ReceiverAccountIdentifier from "./ReceiverAccountIdentifier";

export const initialUser       = {};
export const initialToken      = '';
export const persistItem = localStorage.getItem("persist");
export const initialPersist    = typeof(persistItem) === "string" ? JSON.parse(persistItem) : false;
export const initialTitle      = 'NG Transfert';
export const initialSidebarCollapsed = window.innerWidth < 630;
export const initialNavbarShown = false;
export const initialIsDarkTheme = true;
export const darkColor = 'rgb(0, 21, 41)';
export const lightColor = 'rgb(255, 255, 255)';
export const initialIntroPage = "LandingPage"

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
    topUpMethod         : '',
    currencyId          : null,
    sourceAmount        : null,
    targetAmount        : null,
    sourceCurrencyCode  : null,
    targetCurrencyCode  : "CNY",
    countryOfTopUpId    : '',
    proofPicture        : {file: null, url: null},
}

export const initialReceiverAccountInputs = {
    receiverAccountId           : 0,
    receiverAccountName         : '',
    receiverAccountType         : '',
    clientId                    : 0,
    receiverAccountIdentifier   : ReceiverAccountIdentifier.QR_CODE_IMAGE,
    qrCodeImage                 : {file: null, url: null},
    email                       : '',
    phoneNumber                 : '',
    bankAccountNumber           : '',
    bankId                      : '',
};

export const initialTransferRequestInputs = {
    currencyId              : 0,
    amount                  : 0,
    rate                    : 0,
    remark                  : '',
    receiverAccountType     : '',
    receiverAccountId       : null,
    clientId                : null,
    countryOfDepositId      : null
}

export const initialWechatAccountInputs = {
    wechatAccountId: 0,
    wechatAccountName: '',
    clientId: 0,
    email: '',
    phoneNumber: '',
    wechatQrCodeImage: {file: null, url: null} // This will hold the file object for the image
};

export const initialBankAccountInputs = {
    countryId: 0,
    bankAccountId: 0,
    bankAccountNumber: 0,
    bankId : 0,
    clientId: 0,
    cardHolderName: '',
    bankName: ''
}

export const initialMakePaymentInputs = {
    clientId: 0,
    amount: 0,
    loanId: 0,
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
    validReceiverAccountId          : false,
    validReceiverAccountName        : false,
    validReceiverAccountType        : false,
    validClientId                   : false,
    validReceiverAccountIdentifier  : false,
    validQrCodeImage                : false,
    validEmail                      : false,
    validPhoneNumber                : false,
    validBankAccountNumber          : false,
    validBankId                     : false,
}

export const initialValidWechatAccount = {
    validWechatAccountId: false,
    validWechatAccountName : false,
    validEmail: false,
    validPhoneNumber: false,
    validClientId: false,
    validWechatAccountIdentifier: false,
    validWechatQrCodeImage: false
}

export const initialValidTopUp = {
    validTopUpMethod        : false,
    validCurrencyId         : false,
    validSourceAmount       : false,
    validTargetAmount       : false,
    validCountryOfTopUpId   : false,
    validSourceCurrencyCode : false,
    validTargetCurrencyCode : false,
    validProofPicture       : false,
}

export const initialEventProperties = {
    errorMessage              : '',
    isLoading           : false,
    isError             : false,
    isSuccess           : false,
    successMessage      : ''
}

export const initialLoginSpecifics = {
    identifier          : 'email',
    showBeginnerPrompt  : false,
    showPhone           : false
}

export const initialReceiverAccountSpecifics = {
    identifier          : ReceiverAccountIdentifier.QR_CODE_IMAGE,
    showBeginnerPrompt  : false,
    showPhone           : false,
    showEmail           : false,
    showQrCodeImage     : false
}

export const initialWechatAccountSpecifics = {
    identifier          : 'qrCodeImage',
    showBeginnerPrompt  : false,
    showPhone           : false,
    showEmail           : false,
    showQrCodeImage : false
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
    sourceAmountFocus       : false,
    targetAmountFocus       : false,
    countryOfTopUpIdFocus   : false,
    sourceCurrencyCodeFocus : false,
    targetCurrencyCodeFocus : false,
    proofPictureFocus       : false,
}

export const initialTransferRequestFocus = {
    currencyIdFocus              : false,
    amountFocus                  : false,
    rateFocus                    : false,
    remarkFocus                  : false,
    receiverAccountTypeFocus     : false,
    receiverAccountIdFocus       : false,
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
    receiverAccountIdFocus          : false,
    receiverAccountNameFocus        : false,
    receiverAccountTypeFocus        : false,
    clientIdFocus                   : false,
    receiverAccountIdentifierFocus  : false,
    qrCodeImageFocus                : false,
    emailFocus                      : false,
    phoneNumberFocus                : false,
    bankAccountNumberFocus          : false,
    bankIdFocus                     : false,
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