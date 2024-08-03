export const initialUser       = {};
export const initialToken      = '';
export const persistItem = localStorage.getItem("persist");
export const initialPersist    = typeof(persistItem) === "string" ? JSON.parse(persistItem) : false;
export const initialTitle      = 'NG Transfert';
export const initialSidebarCollapsed = false;
export const initialNavbarShown = false;
export const initialIsDarkTheme = true;
export const darkColor = 'rgb(0, 21, 41)';
export const lightColor = 'rgb(255, 255, 255)';
export const initialCurrentLoans = [];
export const initialRegistrationInputs = {
    fullName            : '',
    email               : '',
    phoneNumber         : '',
    recommender         : '',
    gender              : '',
    title               : '',
    password            : '',
    confirmPassword     : ''
};

export const initialLoanRequestInputs = {
    clientId: 0,
    principal: 0,
    collateral: '',
    reasonForLoan: '',
}

export const initialMakePaymentInputs = {
    clientId: 0,
    amount: 0,
    loanId: 0,
}

export const initialMakePaymentValids = {
    validClientId: false,
    validAmount: false,
    validLoanId: false,
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

export const initialRegistrationValids = {
    validFullName           : false,
    validEmail              : false,
    validPhoneNumber        : false,
    validRecommender        : false,
    validGender             : false,
    validTitle              : false,
    validPassword           : false,
    validConfirmPassword    : false
}

export const initialLoanRequestValids = {
    validClientId: false,
    validPrincipal: false,
    validCollateral: false,
    validReasonForLoan: false
}

export const initialLoanRequestFocus = {
    clientIdFocus: false,
    principalFocus: false,
    collateralFocus: false,
    reasonForLoanFocus: false
}

export const initialMoreInputs = {
    bankAccountNumber    : 0,
    occupation           : '',
    nationalId           : '',
    passportNumber       : ''
}

export const initialMoreInputValids = {
    validBankAccountNumber    : false,
    validOccupation           : false,
    validNationalId           : false,
    validPassportNumber       : false
}

export const initialRegistrationFocus = {
    fullNamec           : false,
    emailFocus              : false,
    phoneNumberFocus        : false,
    recommenderFocus        : false,
    genderFocus             : false,
    titleFocus              : false,
    passwordFocus           : false,
    confirmPasswordFocus    : false
}

export const initialPayments = {
    currentPayment          : {},
    paymentList             : []
}

export const initialToggles = {
    sidebarCollapsed: false,
}

export const initialOpens = {
    loansOpen           : false,
    paymentsOpen        : false,
    pagesOpen           : false,
    clientsOpen         : false,
};

export const initials = {
    initialUser,
    initialToken,
    initialPersist,
    initialTitle,
    initialSidebarCollapsed,
    initialLoginSpecifics,
    initialEventProperties,
    initialRegistrationInputs,
    initialLoanRequestInputs,
    initialRegistrationValids,
    initialLoanRequestValids,
    initialLoanRequestFocus,
    initialRegistrationFocus,
    initialMakePaymentInputs,
    initialMakePaymentValids,
    initialPayments,
    initialToggles,
    initialOpens,
    initialMoreInputs,
    initialMoreInputValids,
    initialIsDarkTheme,
}

export const initialState =  {
    user                : initialUser,
    token               : initialToken,
    persist             : initialPersist,
    title               : initialTitle,
    sidebarCollapsed      : initialSidebarCollapsed,
    navbarShown         : initialNavbarShown,
    loginSpecifics      : initialLoginSpecifics,
    eventProperties     : initialEventProperties,
    registrationInputs  : initialRegistrationInputs,
    registrationValids  : initialRegistrationValids,
    registrationFocus   : initialRegistrationFocus,
    loanRequestInputs   : initialLoanRequestInputs,
    loanRequestValids   : initialLoanRequestValids,
    loanRequestFocus    : initialLoanRequestFocus,
    makePaymentInputs   : initialMakePaymentInputs,
    makePaymentValids   : initialMakePaymentValids,
    payments            : initialPayments,
    opens               : initialOpens,
    moreInputs          : initialMoreInputs,
    moreInputsValids    : initialMoreInputValids,
    isDarkTheme         : initialIsDarkTheme,
    darkColor,
    lightColor,
    currentLoans        : initialCurrentLoans
}

export default initials
