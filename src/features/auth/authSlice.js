import { createSlice } from "@reduxjs/toolkit";
import { initialState} from "../../util/initials";

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken, persist, title } = action.payload
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
            const { key, value } = action.payload;
            state[key] = value;
        },
        setObjectItem: (state, action) => {
            const { key, innerKey, value } = action.payload;
            if (key === "opens" && value === true) {
                // If the key is "opens" and the value is true,
                // set the specified innerKey to true and others to false
                Object.keys(state[key]).forEach(k => {
                    state[key][k] = k === innerKey;
                });
            } else {
                // For other keys or values, set them as usual
                const objectInState = state[key];
                objectInState[innerKey] = value;
            }
        }

    },
})


export const { setCredentials, resetAll, updatePersist, setTitle, setUser, setItem, setObjectItem } = authSlice.actions

export const selectCurrentUser          = (state) => state.auth.user
export const selectCurrentToken         = (state) => state.auth.token
export const selectPersist              = (state) => state.auth.persist
export const selectCurrentTitle         = (state) => state.auth.title
export const selectCurrentInputs        = (state) => state.auth.registrationInputs
export const selectCurrentValids        = (state) => state.auth.registrationValids
export const selectLoanRequestValids    = (state) => state.auth.loanRequestValids
export const selectCurrentFocus         = (state) => state.auth.registrationFocus
export const selectLoanRequestFocus     = (state) => state.auth.loanRequestFocus
export const selectEventProperties      = (state) => state.auth.eventProperties
export const selectLoginSpecifics       = (state) => state.auth.loginSpecifics
export const selectSidebarCollapsed        = (state) => state.auth.sidebarCollapsed
export const selectLoanRequestInputs    = (state) => state.auth.loanRequestInputs
export const selectMakePaymentsInputs    = (state) => state.auth.makePaymentInputs
export const selectMakePaymentsValids    = (state) => state.auth.makePaymentValids
export const selectPayments              = (state) => state.auth.payments
export const selectOpens                 = (state) => state.auth.opens
export const selectMoreInputs            = (state) => state.auth.moreInputs
export const selectMoreInputsValids      = (state) => state.auth.moreInputsValids
export const selectNavbarShown           = (state) => state.auth.navbarShown
export const selectIsDarkTheme           = (state) => state.auth.isDarkTheme
export const selectDarkColor           = (state) => state.auth.darkColor
export const selectLightColor          = (state) => state.auth.lightColor
export default authSlice.reducer