import {createSlice} from "@reduxjs/toolkit";
import { initialState } from "../../util/initials";
import {regex} from "../../util/regex";

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const {user, accessToken, persist, title} = action.payload
            state.user = user
            state.token = accessToken
            state.persist = persist
            state.title = title
        },
        resetAll: (state, action) => {
            state = {
                ...initialState
            }
        },
        updatePersist: (state, action) => {
            state.persist = action.payload
        },
        setItem: (state, action) => {
            const {key, value} = action.payload;
            const trimmedValue = trimIfString(value); // Assuming `trimIfString` trims strings.

            if (typeof trimmedValue === 'string' || typeof trimmedValue === 'number' || typeof trimmedValue === 'boolean') {
                // For primitive values, directly assign to state
                state[key] = trimmedValue;
            } else if (typeof trimmedValue === 'object' && trimmedValue !== null) {
                // If the value is an object, assign its keys to the corresponding state object
                // This will overwrite the state object's keys with those of the new object.
                state[key] = {
                    ...state[key], // Keep the existing keys if any
                    ...trimmedValue // Overwrite or set new values from the provided object
                };
            } else {
                console.error("Unsupported value type in setItem.");
            }
        },
        setObjectItem: (state, action) => {
            const {key, innerKey, value} = action.payload;
            const objectInState = state[key];
            objectInState[innerKey] = trimIfString(value);
        },

        handleBlur: (state, action) => {
            let {objectName, inputName, regexPattern: regexString} = action.payload;

            objectName = trimIfString(objectName);
            inputName = trimIfString(inputName);
            const inputsObjectInState = getInputsObjectInState(state, objectName);
            inputsObjectInState[inputName] = trimIfString(inputsObjectInState[inputName]);

            validateKey(state, objectName, inputName, regexString);
            setFocusObjectInState(state, objectName, inputName, false);

            if (objectName === "registration" && (inputName === "password" || inputName === "confirmPassword")) {
                validateRegistrationPasswords(state);
            }
        },

        handleFocus: (state, action) => {
            let {objectName, inputName} = action.payload;
            // Trim objectName and inputName if they are strings
            inputName = typeof inputName === 'string' ? inputName.trim() : inputName;
            objectName = typeof objectName === 'string' ? objectName.trim() : objectName;
            setFocusObjectInState(state, objectName, inputName, true);
        },

        handleValidation: (state, action) => {
            let {objectName, eventValue, inputName, regexPattern: regexString} = action.payload;

            objectName = trimIfString(objectName);
            inputName = trimIfString(inputName);
            const inputsObjectInState = getInputsObjectInState(state, objectName);
            inputsObjectInState[inputName] = eventValue;

            const validationResult = validateKey(state, objectName, inputName, regexString);

            state.eventProperties["isError"] = false;
            if ((inputName.toLowerCase() === "email" || inputName.toLowerCase() === "phonenumber") && validationResult) {
                state.loginSpecifics["identifier"] = inputName;
            }
            if (objectName === "registration" && (inputName === "password" || inputName === "confirmPassword")) {
                validateRegistrationPasswords(state);
            }
        },
    },
})

const getInputsObjectInState = (state, objectName) => {
    const inputsKeys = objectName.toLowerCase().endsWith("Inputs") ? objectName : `${objectName}Inputs`;
    return state[inputsKeys];
}

const getValidObjectInState = (state, objectName) => {
    const validKey = `valid${objectName.charAt(0).toUpperCase() + objectName.slice(1)}`;
    return state[validKey];
}

const getValidInnerKey = (inputName) => {
    return `valid${inputName.charAt(0).toUpperCase() + inputName.slice(1)}`;
}

const setFocusObjectInState = (state, objectName, inputName, value) => {
    const focusKey = `${objectName}Focus`;
    const focusInnerKey = `${inputName}Focus`;
    const focusObjectInState = state[focusKey];
    focusObjectInState[focusInnerKey] = value;
}

const trimIfString = (item) => {
    return typeof item === 'string' ? item.trim() : item;
}

const validateKey = (state, objectName, inputName, regexString) => {
    const validObjectInState = getValidObjectInState(state, objectName);
    const validInnerKey = getValidInnerKey(inputName);
    const regexPattern = regex[regexString];
    const inputsObjectInState = getInputsObjectInState(state, objectName);
    const result = regexPattern.test(inputsObjectInState[inputName])
    validObjectInState[validInnerKey] = regexPattern.test(inputsObjectInState[inputName]);
    return result;
}

const validateRegistrationPasswords = (state) => {
    state.validRegistration["validPassword"] = regex.CLIENT_PASSWORD_REGEX.test(state.registrationInputs["password"]);
    state.validRegistration["validConfirmPassword"] = Boolean(state.registrationInputs["password"].length > 0) && state.registrationInputs["password"] === state.registrationInputs["confirmPassword"];
};

export const {
    setCredentials,
    resetAll,
    setItem,
    setObjectItem,
    handleFocus,
    handleBlur,
    handleValidation
} = authSlice.actions

export const selectCurrentUser                      = (state) => state.auth.user;
export const selectCurrentToken                     = (state) => state.auth.token;
export const selectPersist                          = (state) => state.auth.persist;
export const selectCurrentTitle                     = (state) => state.auth.title;
export const selectRegistrationInputs               = (state) => state.auth.registrationInputs;
export const selectAlipayAccountInputs              = (state) => state.auth.alipayAccountInputs;
export const selectWechatAccountInputs              = (state) => state.auth.wechatAccountInputs;
export const selectBankAccountInputs                = (state) => state.auth.bankAccountInputs;
export const selectTransferRequestInputs            = (state) => state.auth.transferRequestInputs;
export const selectValidRegistration                = (state) => state.auth.validRegistration;
export const selectValidLogin                       = (state) => state.auth.validLogin;
export const selectValidAlipayAccount               = (state) => state.auth.validAlipayAccount;
export const selectValidBankAccount                 = (state) => state.auth.validBankAccount;
export const selectValidWechatAccount               = (state) => state.auth.validWechatAccount;
export const selectValidLogins                      = (state) => state.auth.validLogin;
export const selectValidTransferRequest             = (state) => state.auth.validTransferRequest;
export const selectAlipayAccountSpecifics           = (state) => state.auth.alipayAccountSpecifics;
export const selectWechatAccountSpecifics           = (state) => state.auth.wechatAccountSpecifics;
export const selectRegistrationFocus                = (state) => state.auth.registrationFocus;
export const selectBankAccountFocus                 = (state) => state.auth.bankAccountFocus;
export const selectTransferRequestFocus             = (state) => state.auth.transferRequestFocus;
export const selectEventProperties                  = (state) => state.auth.eventProperties;
export const selectLoginSpecifics                   = (state) => state.auth.loginSpecifics;
export const selectSidebarCollapsed                 = (state) => state.auth.sidebarCollapsed;
export const selectMakePaymentsInputs               = (state) => state.auth.makePaymentInputs;
export const selectNavbarShown                      = (state) => state.auth.navbarShown;
export const selectIsDarkTheme                      = (state) => state.auth.isDarkTheme;
export const selectDarkColor                        = (state) => state.auth.darkColor;
export const selectLightColor                       = (state) => state.auth.lightColor;
export const selectLoginInputs                      = (state) => state.auth.loginInputs;
export const selectLoginFocus                       = (state) => state.auth.loginFocus;
export const selectAlipayAccountFocus               = (state) => state.auth.alipayAccountFocus;
export const selectWechatAccountFocus               = (state) => state.auth.wechatAccountFocus;

export default authSlice.reducer;
