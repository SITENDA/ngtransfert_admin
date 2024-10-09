import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {
    selectValidAlipayAccount,
    selectEventProperties,
    selectAlipayAccountInputs,
    selectAlipayAccountSpecifics,
    selectAlipayAccountFocus,
    setItem,
    setObjectItem, selectCurrentUser, handleValidation, handleFocus, handleBlur, handleImageChange,
} from "../auth/authSlice";
import EmailInput from "../../components/form-controls/EmailInput";
import PhoneNumberInput from "../../components/form-controls/PhoneNumberInput";
import AlipayAccountNameInput from "../../components/form-controls/AlipayAccountNameInput";
import {
    initialAlipayAccountInputs,
    initialValidAlipayAccount,
    initialAlipayAccountSpecifics,
    initialEventProperties,
} from "../../util/initials";
import ErrorMessageComponent from "../../components/form-controls/ErrorMessageComponent";
import TendaButton from "../../components/form-controls/TendaButton";
import {regex} from "../../util/regex";
import TickAnimation from "../../components/TickAnimation";
import {adminPaths} from "../../util/frontend";
import {useTendaTheme} from "../../components/useTendaTheme";
import {Button, Divider, ThemeProvider, Typography} from "@mui/material";
import MainPageWrapper from "../../components/MainPageWrapper";
import ImageInput from "../../components/form-controls/ImageInput";
import ReceiverAccountType from "../../util/ReceiverAccountType";
import {useCreateReceiverAccountMutation} from "../receiverAccounts/receiverAccountsSlice";

const AddAlipayAccount = () => {
    const [loading, setLoading] = useState(false);  // State variable to track loading status
    const dispatch = useDispatch();
    const location = useLocation();
    const [createReceiverAccount, {isSuccess}] = useCreateReceiverAccountMutation();
    const alipayAccountSpecifics = useSelector(selectAlipayAccountSpecifics);
    const validAlipayAccount = useSelector(selectValidAlipayAccount);
    const eventProperties = useSelector(selectEventProperties);
    const alipayAccountInputs = useSelector(selectAlipayAccountInputs);
    const refs = {
        alipayAccountNameRef: useRef(null),
        persistRef: useRef(null),
        emailRef: useRef(null),
        phoneNumberRef: useRef(null),
        errorRef: useRef(),
        alipayQrCodeRef: useRef(null),
    };
    const theme = useTendaTheme();
    const [tickAnimationVisible, setTickAnimationVisible] = useState(false);
    const currentUser = useSelector(selectCurrentUser);
    const navigate = useNavigate();
    const alipayAccountFocus = useSelector(selectAlipayAccountFocus);

    useEffect(() => {
        dispatch(setItem({key: 'title', value: 'Add Alipay Account'}));
        const currentAlipayAccountSpecifics = {...initialAlipayAccountSpecifics, showQrCodeImage: true};
        dispatch(setItem({key: 'alipayAccountSpecifics', value: currentAlipayAccountSpecifics}));
        refs.alipayAccountNameRef?.current?.focus();
    }, [dispatch, location.state, refs.alipayAccountNameRef]);

    useEffect(() => {
        const result = regex.EMAIL_REGEX.test(alipayAccountInputs.email);
        if (result) dispatch(setObjectItem({key: 'alipayAccountSpecifics', innerKey: "identifier", value: "email"}));
    }, [alipayAccountInputs.email, dispatch]);

    const handleAddAccountSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("receiverAccountName", alipayAccountInputs.alipayAccountName);
            formData.append("receiverAccountType", ReceiverAccountType.ALIPAY_ACCOUNT);
            formData.append("clientId", currentUser?.userId);
            formData.append("receiverAccountIdentifier", alipayAccountSpecifics.identifier);
            formData.append("qrCodeImage", alipayAccountInputs.alipayQrCodeImage?.file || new Blob());
            formData.append("email", alipayAccountInputs.email);
            formData.append("phoneNumber", alipayAccountInputs.phoneNumber);
            formData.append("bankAccountNumber", 0);
            formData.append("bankId", 0);

            // Set loading to true when the request starts
            setLoading(true);
            const response = await createReceiverAccount(formData).unwrap();
            console.log("response : ", response)
            if (response?.statusCode === 200 && response?.message === "Receiver account created successfully") {
                setTickAnimationVisible(true);
                reset();
                setTimeout(() => {
                    navigate(adminPaths.alipayAccountsPath);
                }, 2000);
            }
        } catch (error) {
            console.error('Error generating original QR code:', error);
        } finally {
            setLoading(false);  // Set loading to false when the request completes
        }
    };

    const handleUseEmail = () => {
        const currentAlipayAccountSpecifics = {...initialAlipayAccountSpecifics, showEmail: true};
        dispatch(setItem({key: 'alipayAccountSpecifics', value: currentAlipayAccountSpecifics}));
        dispatch(setObjectItem({
            key: 'alipayAccountSpecifics',
            innerKey: "identifier",
            value: "email"
        }));
    };

    const handleUsePhoneNumber = () => {
        const currentAlipayAccountSpecifics = {...initialAlipayAccountSpecifics, showPhone: true};
        dispatch(setItem({key: 'alipayAccountSpecifics', value: currentAlipayAccountSpecifics}));
        dispatch(setObjectItem({
            key: 'alipayAccountSpecifics',
            innerKey: "identifier",
            value: "phoneNumber"
        }));
    };

    const handleUseAlipayQrCode = () => {
        const currentAlipayAccountSpecifics = {...initialAlipayAccountSpecifics, showQrCodeImage: true};
        dispatch(setItem({key: 'alipayAccountSpecifics', value: currentAlipayAccountSpecifics}));
        dispatch(setObjectItem({
            key: 'alipayAccountSpecifics',
            innerKey: "identifier",
            value: "alipayQrCodeImage"
        }));
    };

    const reset = () => {
        dispatch(setItem({key: 'alipayAccountInputs', value: initialAlipayAccountInputs}));
        dispatch(setItem({key: 'validAlipayAccount', value: initialValidAlipayAccount}));
        dispatch(setItem({key: 'alipayAccountSpecifics', value: initialAlipayAccountSpecifics}));
        dispatch(setItem({key: 'eventProperties', value: initialEventProperties}));
    };

    return (
        <ThemeProvider theme={theme}>
            <MainPageWrapper>
                <section id="login" className="container py-5" style={{height: '100vh'}}>
                    <div className="row justify-content-center">
                        {!tickAnimationVisible && (
                            <div className="col-lg-8">
                                <form onSubmit={handleAddAccountSubmit}>
                                    {<AlipayAccountNameInput
                                        ref={refs.alipayAccountNameRef}
                                        changeHandler={(e) => dispatch(handleValidation({
                                            objectName: "alipayAccount",
                                            eventValue: e.target.value,
                                            inputName: "alipayAccountName",
                                            regexPattern: "ALIPAY_ACCOUNT_NAME_REGEX",
                                        }))}
                                        validAlipayAccountName={validAlipayAccount.validAlipayAccountName}
                                        value={alipayAccountInputs.alipayAccountName}
                                        isFocused={alipayAccountFocus.alipayAccountNameFocus}
                                        handleFocus={() => dispatch(handleFocus({
                                            objectName: 'alipayAccount',
                                            inputName: "alipayAccountName"
                                        }))}
                                        handleBlur={() => dispatch(handleBlur({
                                            objectName: 'alipayAccount',
                                            inputName: "alipayAccountName",
                                            regexPattern: "ALIPAY_ACCOUNT_NAME_REGEX"
                                        }))}
                                    />}
                                    <Divider sx={{my: 3}}/>

                                    {alipayAccountSpecifics.showEmail &&
                                        <EmailInput
                                            ref={refs.emailRef}
                                            changeHandler={(e) => dispatch(handleValidation({
                                                objectName: "alipayAccount",
                                                eventValue: e.target.value,
                                                "inputName": "email",
                                                "regexPattern": "EMAIL_REGEX"
                                            }))}
                                            validEmail={validAlipayAccount.validEmail}
                                            value={alipayAccountInputs.email}
                                            isFocused={alipayAccountFocus.emailFocus}
                                            handleFocus={() => dispatch(handleFocus({
                                                objectName: 'alipayAccount',
                                                inputName: "email"
                                            }))}
                                            handleBlur={() => dispatch(handleBlur({
                                                inputsObject: alipayAccountInputs,
                                                objectName: 'alipayAccount',
                                                inputName: "email",
                                                regexPattern: "EMAIL_REGEX"
                                            }))}
                                        />
                                    }
                                    {alipayAccountSpecifics.showPhone && <PhoneNumberInput
                                        ref={refs.phoneNumberRef}
                                        changeHandler={(e) => dispatch(handleValidation({
                                            objectName: "alipayAccount",
                                            eventValue: e,
                                            "inputName": "phoneNumber",
                                            "regexPattern": "PHONE_NUMBER_REGEX"
                                        }))}
                                        validPhoneNumber={validAlipayAccount.validPhoneNumber}
                                        value={alipayAccountInputs.phoneNumber}
                                        focus={alipayAccountFocus.phoneNumberFocus}/>}
                                    {alipayAccountSpecifics.showQrCodeImage &&
                                        <ImageInput
                                            handleImageChange={(e) => dispatch(handleImageChange({
                                                objectName: "alipayAccount",
                                                file: e.target.files[0],
                                                inputName: "alipayQrCodeImage",
                                                regexPattern: "UPLOAD_IMAGE_URL_REGEX",
                                            }))}
                                            image={alipayAccountInputs.alipayQrCodeImage} label="QR Code Image"/>
                                    }

                                    <Divider sx={{my: 3}}/>

                                    {!alipayAccountSpecifics.showEmail && (
                                        <Typography variant="body2" className="mt-3">
                                            <Button
                                                onClick={handleUseEmail}
                                                variant="text"
                                                sx={{
                                                    fontStyle: "italic",
                                                    color: "white",
                                                    fontSize: '1rem',
                                                    padding: 0, // Removes default padding to make it more like a link
                                                    minWidth: 'auto', // Ensures button size doesn't increase due to default width
                                                    textTransform: 'none', // Keeps the text as it is, without uppercase transformation
                                                }}
                                            >
                                                Use email instead
                                            </Button>
                                        </Typography>
                                    )}

                                    {!alipayAccountSpecifics.showPhone && (
                                        <Typography variant="body2" className="mt-3">
                                            <Button
                                                onClick={handleUsePhoneNumber}
                                                variant="text"
                                                sx={{
                                                    fontStyle: "italic",
                                                    color: "white",
                                                    fontSize: '1rem',
                                                    padding: 0,
                                                    minWidth: 'auto',
                                                    textTransform: 'none',
                                                }}
                                            >
                                                Use phone number instead
                                            </Button>
                                        </Typography>
                                    )}

                                    {!alipayAccountSpecifics.showQrCodeImage && (
                                        <Typography variant="body2" className="mt-3">
                                            <Button
                                                onClick={handleUseAlipayQrCode}
                                                variant="text"
                                                sx={{
                                                    fontStyle: "italic",
                                                    color: "white",
                                                    fontSize: '1rem',
                                                    padding: 0,
                                                    minWidth: 'auto',
                                                    textTransform: 'none',
                                                }}
                                            >
                                                Use Alipay QR Code
                                            </Button>
                                        </Typography>
                                    )}


                                    <ErrorMessageComponent ref={refs.errorRef}/>

                                    {/* Submit Button */}
                                    <div className="d-grid">
                                        <TendaButton
                                            disabled={!((validAlipayAccount.validAlipayQrCodeImage || validAlipayAccount.validEmail || validAlipayAccount.validPhoneNumber) && validAlipayAccount.validAlipayAccountName && !eventProperties.isError)}
                                            buttonText={loading ? 'Adding account...' : 'Add account'}/>
                                    </div>
                                </form>
                            </div>
                        )}
                        {tickAnimationVisible && <TickAnimation successMessage="Alipay account created successfully!"/>}
                    </div>
                </section>
            </MainPageWrapper>
        </ThemeProvider>
    );
};

export default AddAlipayAccount;
