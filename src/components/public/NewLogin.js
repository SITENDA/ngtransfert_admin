import React, {useRef, useState, useEffect} from 'react';
import {useNavigate, Link, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import ErrorBoundary from '../ErrorBoundary';
import {
    selectCurrentUser,
    selectValidLogin,
    selectLoginSpecifics,
    setItem,
    handleValidation, selectLoginInputs, selectLoginFocus, handleFocus, handleBlur, selectCurrentToken
} from '../../features/auth/authSlice';
import {useLoginMutation} from '../../features/auth/authApiSlice';
import {regex} from '../../util/regex';
import EmailInput from '../form-controls/EmailInput';
import PhoneNumberInput from '../form-controls/PhoneNumberInput';
import PasswordInput from '../form-controls/PasswordInput';
import {setObjectItem} from '../../features/auth/authSlice';
import {
    initialLoginInputs,
    initialValidLogin,
    initialEventProperties,
    initialLoginFocus,
    initialLoginSpecifics
} from '../../util/initials';
import {selectPersist} from '../../features/auth/authSlice';
import ErrorMessageComponent from '../form-controls/ErrorMessageComponent';
import TendaButton from '../form-controls/TendaButton';
import {adminPaths} from "../../util/frontend";
import {ResponseHandler} from "../ResponseHandler";

const NewLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading] = useState(false);
    const [login, {isSuccess}] = useLoginMutation();
    const persist = useSelector(selectPersist)
    const location = useLocation();
    const refs = {
        passwordRef: useRef(null),
        emailRef: useRef(null),
        phoneNumberRef: useRef(null),
        errorRef: useRef(null)
    }
    const loginInputs = useSelector(selectLoginInputs)
    const validLogin = useSelector(selectValidLogin)
    const loginFocus = useSelector(selectLoginFocus)
    const loginSpecifics = useSelector(selectLoginSpecifics)
    const user = useSelector(selectCurrentUser)
    const allowedRoles = ["ADMIN"];
    const hasRole = user?.roles?.find(role => allowedRoles?.includes(role.roleName));
    const token = useSelector(selectCurrentToken);

    useEffect(() => {
        if (Boolean(user?.fullName) && hasRole && token?.length > 0 && token !== "nothing") {
            navigate(adminPaths.homePath, {replace: true})
        } else {
            dispatch(setItem({key: 'title', value: 'Login to NGTransfert!'}));
            dispatch(setItem({key: 'sidebarCollapsed', value: window.innerWidth < 900}));
        }
        refs.emailRef.current.focus();
    }, [dispatch, refs.emailRef, navigate, user?.fullName, hasRole, token])

    useEffect(() => {
        const prevPath = location.state?.prevPath || "none";
        dispatch(setObjectItem({
            key: 'loginSpecifics',
            innerKey: "showBeginnerPrompt",
            value: (prevPath === adminPaths.registerPath || prevPath === adminPaths.registrationSuccessPath)
        }));
    }, [dispatch, location.state])

    const handleLoginWith = () => {
        dispatch(setObjectItem({key: 'loginSpecifics', innerKey: "showPhone", value: !loginSpecifics.showPhone}));
        dispatch(setObjectItem({
            key: 'loginSpecifics',
            innerKey: "identifier",
            value: loginSpecifics.identifier === "email" ? "phone" : "email"
        }));
    }

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        const correctEmail = regex.EMAIL_REGEX.test(loginInputs.email)
        const correctPhone = regex.PHONE_NUMBER_REGEX.test(loginInputs.phoneNumber)
        const correctPassword = regex.ADMIN_PASSWORD_REGEX.test(loginInputs.password)

        if (!((correctEmail || correctPhone) && correctPassword)) {
            dispatch(setObjectItem({key: 'eventProperties', innerKey: "errorMessage", value: 'Invalid Entry'}));
            return;
        }
        const email = correctEmail ? loginInputs.email : "none";
        const phoneNumber = correctPhone ? loginInputs.phoneNumber : "none";
        try {
            const loginInfo = {
                email,
                phoneNumber,
                password: loginInputs.password,
                identifier: loginSpecifics.identifier,
            }
            dispatch(setObjectItem({key: 'eventProperties', innerKey: "isLoading", value: true}));
            const response = await login(loginInfo).unwrap();
            if (isSuccess) dispatch(setObjectItem({key: 'eventProperties', innerKey: "isLoading", value: false}));
            if (response?.statusCode === 200) {
                const user = response?.data?.user;
                const token = response?.data?.token;
                if (persist) localStorage.setItem("persist", JSON.stringify(persist))
                dispatch(setItem({key: 'user', value: user}));
                dispatch(setItem({key: 'token', value: token}));
                reset();
                const nextPath = location.state?.from?.pathname || adminPaths.homePath;
                navigate(nextPath, {replace: true, state: {prevPath: location.pathname}});
            } else await ResponseHandler(response, refs, dispatch);
        } catch (error) {
            dispatch(setObjectItem({key: 'eventProperties', innerKey: "isLoading", value: false}));
            await dispatch(setObjectItem({
                key: 'eventProperties', innerKey: "errorMessage",
                value: "Error logging in."
            }));
            await dispatch(setObjectItem({key: 'eventProperties', innerKey: "isError", value: true}));
        }
    };

    const reset = () => {
        dispatch(setItem({key: 'loginInputs', value: initialLoginInputs}));
        dispatch(setItem({key: 'loginFocus', value: initialLoginFocus}));
        dispatch(setItem({key: 'validLogin', value: initialValidLogin}));
        dispatch(setItem({key: 'loginSpecifics', value: initialLoginSpecifics}));
        dispatch(setItem({key: 'eventProperties', value: initialEventProperties}));
    }

    return (
        <section className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <ErrorBoundary fallback="Error in showing error">
                        <form onSubmit={handleLoginSubmit}>
                            {loginSpecifics.showBeginnerPrompt && (<div className="alert alert-success" role="alert">
                                Sign in using your email or phone number, and the password that you've just created.
                            </div>)}

                            {!loginSpecifics.showPhone && <EmailInput
                                ref={refs.emailRef}
                                changeHandler={(e) => dispatch(handleValidation({
                                    objectName: "login",
                                    eventValue: e.target.value,
                                    inputName: "email",
                                    regexPattern: "EMAIL_REGEX"
                                }))}
                                validEmail={validLogin.validEmail}
                                value={loginInputs.email}
                                isFocused={loginFocus.emailFocus}
                                handleFocus={() => dispatch(handleFocus({objectName: 'login', inputName: "email"}))}
                                handleBlur={() => dispatch(handleBlur({
                                    objectName: 'login',
                                    inputName: "email",
                                    regexPattern: "EMAIL_REGEX"
                                }))}
                            />
                            }
                            {loginSpecifics.showPhone && <PhoneNumberInput
                                ref={refs.phoneNumberRef}
                                changeHandler={(e) => dispatch(handleValidation({
                                    objectName: "login",
                                    eventValue: e,
                                    inputName: "phoneNumber",
                                    regexPattern: "PHONE_NUMBER_REGEX"
                                }))}
                                validPhoneNumber={validLogin.validPhoneNumber}
                                value={loginInputs.phoneNumber}
                                focus={loginFocus.phoneNumberFocus}/>}

                            <p className="mt-3">
                                <Link onClick={handleLoginWith}
                                      style={{textDecoration: "none", fontStyle: "italic", color: "#099ff6"}} to="#">
                                    Login with {loginSpecifics.showPhone ? "email" : "phone number"} instead</Link>
                            </p>

                            <PasswordInput
                                ref={refs.passwordRef}
                                changeHandler={(e) => dispatch(handleValidation({
                                    objectName: "login",
                                    eventValue: e.target.value,
                                    inputName: "password",
                                    regexPattern: "ADMIN_PASSWORD_REGEX"
                                }))}
                                validPassword={validLogin.validPassword}
                                value={loginInputs.password}
                                isFocused={validLogin.passwordFocus}
                                handleFocus={() => dispatch(handleFocus({objectName: 'login', inputName: "password"}))}
                                handleBlur={() => dispatch(handleBlur({
                                    objectName: 'login',
                                    inputName: "password",
                                    regexPattern: "ADMIN_PASSWORD_REGEX"
                                }))}
                            />

                            <ErrorMessageComponent ref={refs.errorRef}/>

                            {/* Submit Button */}
                            <div className="d-grid">
                                <TendaButton
                                    //!((valids.validPhoneNumber || valids.validEmail) && valids.validPassword && !eventProperties.isError)
                                    disabled={false}
                                    buttonText={loading ? 'Signing In...' : 'Sign In'}/>
                            </div>
                        </form>
                    </ErrorBoundary>
                </div>
            </div>
        </section>
    );
};

export default NewLogin
