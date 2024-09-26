import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../../features/users/usersSlice';
import { regex } from '../../util/regex';
import {
    selectCurrentInputs,
    selectCurrentUser,
    selectCurrentValids,
    selectIsDarkTheme,
    setItem,
    setObjectItem
} from '../../features/auth/authSlice';
import FullNameInput from '../form-controls/FullNameInput';
import EmailInput from '../form-controls/EmailInput';
import PasswordInput from '../form-controls/PasswordInput';
import ConfirmPasswordInput from '../form-controls/ConfirmPasswordInput';
import PhoneNumberInput from '../form-controls/PhoneNumberInput';
import GenderInput from '../form-controls/GenderInput';
import TitleInput from '../form-controls/TitleInput';
import initials from '../../util/initials';
import TickAnimation from '../TickAnimation';
import { adminPaths } from '../../util/frontend';
import TendaButton from '../form-controls/TendaButton';
import MainPageWrapper from "../MainPageWrapper";
import { ThemeProvider, createTheme, Box, Container, Paper, Alert } from '@mui/material';
import { darkColor, lightColor } from '../../util/initials';

const RegisterAdmin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const inputs = useSelector(selectCurrentInputs);
    const valids = useSelector(selectCurrentValids);
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const admin = useSelector(selectCurrentUser);
    const [register, { isLoading: isRegisterLoading, isError: isRegisterError, error: registerError }] = useRegisterMutation();
    const { initialRegistrationInputs, initialRegistrationValids, initialRegistrationFocus, initialEventProperties } = initials;
    const refs = {
        fullNameRef: useRef(null),
        emailRef: useRef(null),
        phoneNumberRef: useRef(null),
        genderRef: useRef(),
        titleRef: useRef(),
        errorRef: useRef(),
        passwordRef: useRef(),
        confirmPasswordRef: useRef()
    };
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

    useEffect(() => {
        const handleValidation = (inputName, regexPattern) => {
            const result = regexPattern.test(inputs[inputName]);
            const innerKey = `valid${inputName.charAt(0).toUpperCase() + inputName.slice(1)}`;
            dispatch(setObjectItem({ key: 'registrationValids', innerKey, value: result }));
        };
        handleValidation('fullName', regex.FULL_NAME_REGEX);
        handleValidation('email', regex.EMAIL_REGEX);
        handleValidation('phoneNumber', regex.PHONE_NUMBER_REGEX);
        handleValidation('gender', regex.GENDER_REGEX);
        handleValidation('title', regex.TITLE_REGEX);
    }, [inputs, dispatch]);

    useEffect(() => {
        dispatch(setItem({ key: 'title', value: 'Register New Client' }));
        refs.fullNameRef.current.focus();
    }, [dispatch, refs.fullNameRef]);

    useEffect(() => {
        const result = regex.PASSWORD_REGEX.test(inputs.password);
        dispatch(setObjectItem({ key: 'registrationValids', innerKey: "validPassword", value: result }));
        const match = Boolean(inputs.password) && inputs.password === inputs.confirmPassword;
        dispatch(setObjectItem({ key: 'registrationValids', innerKey: "validConfirmPassword", value: match }));
    }, [inputs.password, inputs.confirmPassword, dispatch]);

    useEffect(() => {
        dispatch(setObjectItem({ key: 'eventProperties', innerKey: "errorMessage", value: initialEventProperties.errorMessage }));
    }, [dispatch, initialEventProperties]);

    const handleRegistrationSubmit = async (event) => {
        event.preventDefault();
        const v1 = regex.FULL_NAME_REGEX.test(inputs.fullName);
        const v2 = regex.EMAIL_REGEX.test(inputs.email);
        const v3 = regex.PHONE_NUMBER_REGEX.test(inputs.phoneNumber);
        const v4 = regex.GENDER_REGEX.test(inputs.gender);
        const v5 = regex.TITLE_REGEX.test(inputs.title);
        const v6 = regex.RECOMMENDER_REGEX.test(admin.recommender);
        const v7 = regex.PASSWORD_REGEX.test(inputs.password);

        if (!(v1 && v2 && v3 && v4 && v5 && v6 && v7)) {
            await dispatch(setObjectItem({ key: 'eventProperties', innerKey: "errMsg", value: 'Invalid Entry' }));
            return;
        }
        await dispatch(setObjectItem({ key: 'eventProperties', innerKey: "isLoading", value: true }));
        const registerInfo = {
            fullName: inputs.fullName,
            identifier: "email",
            email: inputs.email,
            phoneNumber: inputs.phoneNumber,
            gender: inputs.gender,
            title: inputs.title,
            recommender: admin.fullName,
            password: inputs.password
        };
        try {
            const response = await register(registerInfo);
            if (response?.data?.statusCode === 201 && response?.data?.message === "User created successfully") {
                dispatch(setItem({ key: 'registrationInputs', value: initialRegistrationInputs }));
                dispatch(setItem({ key: 'registrationFocus', value: initialRegistrationFocus }));
                dispatch(setItem({ key: 'registrationValids', value: initialRegistrationValids }));
                setShowSuccessAnimation(true);
                setTimeout(() => {
                    navigate(adminPaths.ClientsListPath);
                }, 2000);
            }
        } catch (error) {
            dispatch(setObjectItem({ key: 'eventProperties', innerKey: "isLoading", value: false }));
            console.error('Registration failed:', error);
            const message = error ? error : 'Registration failed. Please try again.';
            dispatch(setObjectItem({ key: 'eventProperties', innerKey: "errMsg", value: message }));
        }
    };

    const theme = createTheme({
        palette: {
            mode: isDarkTheme ? 'dark' : 'light',
            background: {
                default: isDarkTheme ? darkColor : lightColor,
                paper: isDarkTheme ? darkColor : lightColor,
            },
            text: {
                primary: isDarkTheme ? lightColor : darkColor,
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <MainPageWrapper>
                <Container component="section" maxWidth="sm" sx={{ py: 5 }}>
                    {!showSuccessAnimation ? (
                        <Paper elevation={3} sx={{ p: 3, backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}>
                            {isRegisterError && (
                                <Alert severity="error" ref={refs.errorRef}>
                                    {registerError}
                                </Alert>
                            )}
                            <form onSubmit={handleRegistrationSubmit}>
                                <FullNameInput ref={refs.fullNameRef} />
                                <EmailInput ref={refs.emailRef} />
                                <PhoneNumberInput ref={refs.phoneNumberRef} />
                                <GenderInput ref={refs.genderRef} />
                                <TitleInput ref={refs.genderRef} />
                                <PasswordInput ref={refs.passwordRef} />
                                <ConfirmPasswordInput ref={refs.confirmPasswordRef} />

                                <Box sx={{ mt: 3 }}>
                                    <TendaButton
                                        disabled={!(
                                            valids.validPhoneNumber &&
                                            valids.validFullName &&
                                            valids.validEmail &&
                                            valids.validGender &&
                                            valids.validTitle &&
                                            valids.validPassword &&
                                            valids.validConfirmPassword
                                        )}
                                        buttonText={isRegisterLoading ? 'Registering...' : 'Register'}
                                    />
                                </Box>
                            </form>
                        </Paper>
                    ) : (
                        <TickAnimation successMessage="Client registered successfully!" />
                    )}
                </Container>
            </MainPageWrapper>
        </ThemeProvider>
    );
};

export default RegisterAdmin;
