import React, {useRef, useState, useEffect} from 'react';
import {useNavigate, Link, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import ErrorBoundary from '../ErrorBoundary';
import {
    selectCurrentInputs,
    selectCurrentUser,
    selectCurrentValids,
    selectEventProperties,
    selectLoginSpecifics,
    setItem,
    selectIsDarkTheme
} from '../../features/auth/authSlice';
import '../../assets/css/form-styles.css'
import {useLoginMutation} from '../../features/auth/authApiSlice';
import {regex} from '../../util/regex';
import EmailInput from '../form-controls/EmailInput';
import PhoneNumberInput from '../form-controls/PhoneNumberInput';
import PasswordInput from '../form-controls/PasswordInput';
import {setObjectItem} from '../../features/auth/authSlice';
import initials from '../../util/initials';
import {selectPersist} from '../../features/auth/authSlice';
import ErrorMessageComponent from '../form-controls/ErrorMessageComponent';
import TendaButton from '../form-controls/TendaButton';
import {darkColor, lightColor} from '../../util/initials';
import {adminPaths} from "../../util/frontend";

export const ResponseHandler = async (response, refs) => {
    const dispatch = useDispatch();
    if (response?.statusCode === 404 && response?.message === "User with these credentials does not exist") {
        await dispatch(setObjectItem({
            key: 'eventProperties', innerKey: "errorMessage",
            value: <>A user with these credentials does not exist. <br/>
                Please try again or register for a new account in case it is your first time at Novic.</>
        }));
        await dispatch(setObjectItem({key: 'eventProperties', innerKey: "isError", value: true}));
        refs.errorRef.current.focus();
    } else if (response?.statusCode !== 200 && response?.message) {
        await dispatch(setObjectItem({
            key: 'eventProperties', innerKey: "errorMessage",
            value: <>{response.message}</>
        }));
        await dispatch(setObjectItem({key: 'eventProperties', innerKey: "isError", value: true}));
        refs.errorRef.current.focus();
    } else if (response?.details) {
        await dispatch(setObjectItem({
            key: 'eventProperties', innerKey: "errorMessage",
            value: response.details
        }));
        await dispatch(setObjectItem({key: 'eventProperties', innerKey: "isError", value: true}));
    } else {
        await dispatch(setObjectItem({
            key: 'eventProperties', innerKey: "errorMessage",
            value: "An unknown error occurred."
        }));
        await dispatch(setObjectItem({key: 'eventProperties', innerKey: "isError", value: true}));
    }
}

const NewLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading] = useState(false);
    const {
        initialRegistrationInputs,
        initialRegistrationValids,
        initialRegistrationFocus,
        initialLoginSpecifics,
        initialEventProperties
    } = initials
    const [login, {isSuccess}] = useLoginMutation();
    const persist = useSelector(selectPersist)
    const location = useLocation();
    const refs = {
        passwordRef: useRef(null),
        persistRef: useRef(null),
        emailRef: useRef(null),
        phoneNumberRef: useRef(null),
        errorRef: useRef()
    }
    const inputs = useSelector(selectCurrentInputs)
    const valids = useSelector(selectCurrentValids)
    const loginSpecifics = useSelector(selectLoginSpecifics)
    const eventProperties = useSelector(selectEventProperties)
    const user = useSelector(selectCurrentUser)
    const isDarkTheme = useSelector(selectIsDarkTheme);

    useEffect(() => {
        if (Boolean(user?.fullName)) {
            navigate(adminPaths.homePath, {replace: true})
        } else {
            dispatch(setItem({key: 'title', value: 'Login to Novic!'}));
        }
        //refs.emailRef.current.focus();
    }, [dispatch, refs.emailRef, navigate, user?.fullName, user.ekiddako])

    useEffect(() => {
        const prevPath = location.state?.prevPath || "none";
        dispatch(setObjectItem({
            key: 'loginSpecifics',
            innerKey: "showBeginnerPrompt",
            value: prevPath === "/registrationsuccess"
        }));
    }, [dispatch, location.state])

    useEffect(() => {
        const result = regex.EMAIL_REGEX.test(inputs.email);
        if (result) dispatch(setObjectItem({key: 'loginSpecifics', innerKey: "identifier", value: "email"}));
        dispatch(setObjectItem({key: 'registrationValids', innerKey: "validEmail", value: result}));
    }, [inputs.email, dispatch])

    useEffect(() => {
        const result = regex.PHONE_NUMBER_REGEX.test(inputs.phoneNumber);
        if (result) dispatch(setObjectItem({key: 'loginSpecifics', innerKey: "identifier", value: "phoneNumber"}));
        dispatch(setObjectItem({key: 'registrationValids', innerKey: "validPhoneNumber", value: result}));
    }, [inputs.phoneNumber, dispatch])

    useEffect(() => {
        const result = regex.PASSWORD_REGEX.test(inputs.password);
        dispatch(setObjectItem({key: 'registrationValids', innerKey: "validPassword", value: result}));
    }, [inputs.password, dispatch])


    const handlePersistChange = async (e) => {
        await dispatch(setItem({key: 'persist', value: e.target.checked}));
        const item = localStorage.getItem("persist")
        if (item == null) {
            localStorage.setItem("persist", e.target.checked)
        } else {
            localStorage.removeItem("persist")
        }
    };


    const handleRegisterWith = () => {
        dispatch(setObjectItem({key: 'loginSpecifics', innerKey: "showPhone", value: !loginSpecifics.showPhone}));
        dispatch(setObjectItem({
            key: 'loginSpecifics',
            innerKey: "identifier",
            value: loginSpecifics.identifier === "email" ? "phone" : "email"
        }));
    }

    useEffect(() => {
        dispatch(setObjectItem({
            key: 'eventProperties',
            innerKey: "errorMessage",
            value: initialEventProperties.errorMessage
        }));
        dispatch(setObjectItem({key: 'eventProperties', innerKey: "isError", value: false}));
    }, [inputs.phoneNumber, inputs.email, inputs.password, initialEventProperties.errorMessage, dispatch])


    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        const correctEmail = regex.EMAIL_REGEX.test(inputs.email)
        const correctPhone = regex.PHONE_NUMBER_REGEX.test(inputs.phoneNumber)
        const correctPassword = regex.PASSWORD_REGEX.test(inputs.password)

        if (!((correctEmail || correctPhone) && correctPassword)) {
            dispatch(setObjectItem({key: 'eventProperties', innerKey: "errorMessage", value: 'Invalid Entry'}));
            return;
        }
        const email = correctEmail ? inputs.email : "none";
        const phoneNumber = correctPhone ? inputs.phoneNumber : "none";
        try {
            const loginInfo = {
                email,
                phoneNumber,
                password: inputs.password,
                identifier: loginSpecifics.identifier,
            }
            dispatch(setObjectItem({key: 'eventProperties', innerKey: "isLoading", value: true}));
            const response = await login(loginInfo).unwrap();
            console.log("Response is : ", response);
            if (isSuccess) dispatch(setObjectItem({key: 'eventProperties', innerKey: "isLoading", value: false}));
            if (response?.statusCode === 200) {
                const user = response?.data?.user;
                const token = response?.data?.token;
                if (persist) localStorage.setItem("persist", JSON.stringify(persist))
                dispatch(setItem({key: 'user', value: user}));
                dispatch(setItem({key: 'token', value: token}));
                dispatch(setItem({key: 'persist', value: persist}));
                dispatch(setItem({key: 'registrationInputs', value: initialRegistrationInputs}));
                dispatch(setItem({key: 'registrationFocus', value: initialRegistrationFocus}));
                dispatch(setItem({key: 'registrationValids', value: initialRegistrationValids}));
                const nextPath = location.state?.from?.pathname || adminPaths.homePath;
                navigate(nextPath, {replace: true, state: {prevPath: location.pathname}});
                reset();
            } else await ResponseHandler(response, refs);
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
        dispatch(setItem({key: 'registrationInputs', value: initialRegistrationInputs}));
        dispatch(setItem({key: 'registrationValids', value: initialRegistrationValids}));
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

                            {!loginSpecifics.showPhone && <EmailInput ref={refs.emailRef}/>}
                            {loginSpecifics.showPhone && <PhoneNumberInput ref={refs.phoneNumberRef}/>}

                            <p className="mt-3">
                                <Link onClick={handleRegisterWith}
                                      style={{textDecoration: "none", fontStyle: "italic", color: "#099ff6"}} to="#">
                                    Login with {loginSpecifics.showPhone ? "email" : "phone number"} instead</Link>
                            </p>

                            <PasswordInput ref={refs.passwordRef}/>

                            {/* Trust This Device */}
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="persist"
                                       name="persist" onChange={handlePersistChange}/>
                                <label className="form-check-label" htmlFor="persist"
                                       style={{color: isDarkTheme ? lightColor : darkColor}}>Trust This Device</label>
                            </div>
                            <ErrorMessageComponent ref={refs.errorRef}/>

                            {/* Submit Button */}
                            <div className="d-grid">
                                <TendaButton
                                    disabled={!((valids.validPhoneNumber || valids.validEmail) && valids.validPassword && !eventProperties.isError)}
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
