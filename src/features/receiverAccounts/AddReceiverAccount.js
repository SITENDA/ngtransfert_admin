import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {
    selectValidReceiverAccount,
    selectEventProperties,
    selectReceiverAccountInputs,
    selectReceiverAccountSpecifics,
    selectReceiverAccountFocus,
    setItem,
    setObjectItem, selectCurrentUser, handleValidation, handleFocus, handleBlur, handleImageChange,
} from "../auth/authSlice";
import EmailInput from "../../components/form-controls/EmailInput";
import PhoneNumberInput from "../../components/form-controls/PhoneNumberInput";
import ReceiverAccountNameInput from "../../components/form-controls/ReceiverAccountNameInput";
import {
    initialReceiverAccountInputs,
    initialValidReceiverAccount,
    initialReceiverAccountSpecifics,
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
import {useCreateReceiverAccountMutation} from "./receiverAccountsSlice";
import ReceiverAccountIdentifier from "../../util/ReceiverAccountIdentifier";

const AddReceiverAccount = () => {
    const [loading, setLoading] = useState(false);  // State variable to track loading status
    const dispatch = useDispatch();
    const location = useLocation();
    const [createReceiverAccount, {isSuccess}] = useCreateReceiverAccountMutation();
    const receiverAccountSpecifics = useSelector(selectReceiverAccountSpecifics);
    const validReceiverAccount = useSelector(selectValidReceiverAccount);
    const eventProperties = useSelector(selectEventProperties);
    const receiverAccountInputs = useSelector(selectReceiverAccountInputs);
    const refs = {
        receiverAccountNameRef: useRef(null),
        persistRef: useRef(null),
        emailRef: useRef(null),
        phoneNumberRef: useRef(null),
        errorRef: useRef(),
        receiverQrCodeRef: useRef(null),
    };
    const theme = useTendaTheme();
    const [tickAnimationVisible, setTickAnimationVisible] = useState(false);
    const currentUser = useSelector(selectCurrentUser);
    const navigate = useNavigate();
    const receiverAccountFocus = useSelector(selectReceiverAccountFocus);

    useEffect(() => {
        dispatch(setItem({key: 'title', value: 'Add Receiver Account'}));
        const currentReceiverAccountSpecifics = {...initialReceiverAccountSpecifics, showQrCodeImage: true};
        dispatch(setItem({key: 'receiverAccountSpecifics', value: currentReceiverAccountSpecifics}));
        refs.receiverAccountNameRef?.current?.focus();
    }, [dispatch, location.state, refs.receiverAccountNameRef]);

    useEffect(() => {
        const result = regex.EMAIL_REGEX.test(receiverAccountInputs.email);
        if (result) dispatch(setObjectItem({key: 'receiverAccountSpecifics', innerKey: "identifier", value: "email"}));
    }, [receiverAccountInputs.email, dispatch]);

    const handleAddAccountSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("receiverAccountName", receiverAccountInputs.receiverAccountName);
            formData.append("receiverAccountType", receiverAccountInputs.receiverAccountType);
            formData.append("clientId", currentUser?.userId);
            formData.append("receiverAccountIdentifier", receiverAccountSpecifics.identifier);
            formData.append("qrCodeImage", receiverAccountInputs.qrCodeImage?.file || new Blob());
            formData.append("email", receiverAccountInputs.email);
            formData.append("phoneNumber", receiverAccountInputs.phoneNumber);
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
                    navigate(adminPaths.receiverAccountsPath);
                }, 2000);
            }
        } catch (error) {
            console.error('Error generating original QR code:', error);
        } finally {
            setLoading(false);  // Set loading to false when the request completes
        }
    };

    const handleUseEmail = () => {
        const currentReceiverAccountSpecifics = {...initialReceiverAccountSpecifics, showEmail: true};
        dispatch(setItem({key: 'receiverAccountSpecifics', value: currentReceiverAccountSpecifics}));
        dispatch(setObjectItem({
            key: 'receiverAccountSpecifics',
            innerKey: "identifier",
            value: "email"
        }));
    };

    const handleUsePhoneNumber = () => {
        const currentReceiverAccountSpecifics = {...initialReceiverAccountSpecifics, showPhone: true};
        dispatch(setItem({key: 'receiverAccountSpecifics', value: currentReceiverAccountSpecifics}));
        dispatch(setObjectItem({
            key: 'receiverAccountSpecifics',
            innerKey: "identifier",
            value: ReceiverAccountIdentifier.PHONE_NUMBER
        }));
    };

    const handleUseQrCode = () => {
        const currentReceiverAccountSpecifics = {...initialReceiverAccountSpecifics, showQrCodeImage: true};
        dispatch(setItem({key: 'receiverAccountSpecifics', value: currentReceiverAccountSpecifics}));
        dispatch(setObjectItem({
            key: 'receiverAccountSpecifics',
            innerKey: "identifier",
            value: ReceiverAccountIdentifier.QR_CODE_IMAGE
        }));
    };

    const reset = () => {
        dispatch(setItem({key: 'receiverAccountInputs', value: initialReceiverAccountInputs}));
        dispatch(setItem({key: 'validReceiverAccount', value: initialValidReceiverAccount}));
        dispatch(setItem({key: 'receiverAccountSpecifics', value: initialReceiverAccountSpecifics}));
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
                                    {<ReceiverAccountNameInput
                                        ref={refs.ReceiverAccountNameRef}
                                        changeHandler={(e) => dispatch(handleValidation({
                                            objectName: "receiverAccount",
                                            eventValue: e.target.value,
                                            inputName: "receiverAccountName",
                                            regexPattern: "RECEIVER_ACCOUNT_NAME_REGEX",
                                        }))}
                                        validReceiverAccountName={validReceiverAccount.validReceiverAccountName}
                                        value={receiverAccountInputs.receiverAccountName}
                                        isFocused={receiverAccountFocus.receiverAccountNameFocus}
                                        handleFocus={() => dispatch(handleFocus({
                                            objectName: 'receiverAccount',
                                            inputName: "receiverAccountName"
                                        }))}
                                        handleBlur={() => dispatch(handleBlur({
                                            objectName: 'receiverAccount',
                                            inputName: "receiverAccountName",
                                            regexPattern: "RECEIVER_ACCOUNT_NAME_REGEX"
                                        }))}
                                    />}
                                    <Divider sx={{my: 3}}/>

                                    {receiverAccountSpecifics.showEmail &&
                                        <EmailInput
                                            ref={refs.emailRef}
                                            changeHandler={(e) => dispatch(handleValidation({
                                                objectName: "receiverAccount",
                                                eventValue: e.target.value,
                                                "inputName": "email",
                                                "regexPattern": "EMAIL_REGEX"
                                            }))}
                                            validEmail={validReceiverAccount.validEmail}
                                            value={receiverAccountInputs.email}
                                            isFocused={receiverAccountFocus.emailFocus}
                                            handleFocus={() => dispatch(handleFocus({
                                                objectName: 'receiverAccount',
                                                inputName: "email"
                                            }))}
                                            handleBlur={() => dispatch(handleBlur({
                                                inputsObject: receiverAccountInputs,
                                                objectName: 'receiverAccount',
                                                inputName: "email",
                                                regexPattern: "EMAIL_REGEX"
                                            }))}
                                        />
                                    }
                                    {receiverAccountSpecifics.showPhone && <PhoneNumberInput
                                        ref={refs.phoneNumberRef}
                                        changeHandler={(e) => dispatch(handleValidation({
                                            objectName: "receiverAccount",
                                            eventValue: e,
                                            "inputName": "phoneNumber",
                                            "regexPattern": "PHONE_NUMBER_REGEX"
                                        }))}
                                        validPhoneNumber={validReceiverAccount.validPhoneNumber}
                                        value={receiverAccountInputs.phoneNumber}
                                        focus={receiverAccountFocus.phoneNumberFocus}/>}
                                    {receiverAccountSpecifics.showQrCodeImage &&
                                        <ImageInput
                                            handleImageChange={(e) => dispatch(handleImageChange({
                                                objectName: "receiverAccount",
                                                file: e.target.files[0],
                                                inputName: "qrCodeImage",
                                                regexPattern: "UPLOAD_IMAGE_URL_REGEX",
                                            }))}
                                            image={receiverAccountInputs.qrCodeImage} label="QR Code Image"/>
                                    }

                                    <Divider sx={{my: 3}}/>

                                    {!receiverAccountSpecifics.showEmail && (
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

                                    {!receiverAccountSpecifics.showPhone && (
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

                                    {!receiverAccountSpecifics.showQrCodeImage && (
                                        <Typography variant="body2" className="mt-3">
                                            <Button
                                                onClick={handleUseQrCode}
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
                                                Use QR Code
                                            </Button>
                                        </Typography>
                                    )}


                                    <ErrorMessageComponent ref={refs.errorRef}/>

                                    {/* Submit Button */}
                                    <div className="d-grid">
                                        <TendaButton
                                            disabled={!((validReceiverAccount.validQrCodeImage || validReceiverAccount.validEmail || validReceiverAccount.validPhoneNumber) && validReceiverAccount.validReceiverAccountName && !eventProperties.isError)}
                                            buttonText={loading ? 'Adding account...' : 'Add account'}/>
                                    </div>
                                </form>
                            </div>
                        )}
                        {tickAnimationVisible && <TickAnimation successMessage="Receiver account created successfully!"/>}
                    </div>
                </section>
            </MainPageWrapper>
        </ThemeProvider>
    );
};

export default AddReceiverAccount;
