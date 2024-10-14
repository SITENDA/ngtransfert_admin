import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {
    selectValidReceiverAccount,
    selectEventProperties,
    selectReceiverAccountInputs,
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
import TickAnimation from "../../components/TickAnimation";
import {adminPaths} from "../../util/frontend";
import {useTendaTheme} from "../../components/useTendaTheme";
import {Button, Divider, ThemeProvider, Typography} from "@mui/material";
import MainPageWrapper from "../../components/MainPageWrapper";
import ImageInput from "../../components/form-controls/ImageInput";
import {useCreateReceiverAccountMutation} from "./receiverAccountsSlice";
import ReceiverAccountIdentifier from "../../util/ReceiverAccountIdentifier";
import ReceiverAccountTypeSelector from "../../components/form-controls/ReceiverAccountTypeSelector";
import ReceiverAccountType from "../../util/ReceiverAccountType";
import BankSelector from "../../components/form-controls/BankSelector";
import BankNameInput from "../../components/form-controls/BankNameInput";
import CardHolderNameInput from "../../components/form-controls/CardHolderNameInput";
import BankAccountNumberInput from "../../components/form-controls/BankAccountNumberInput";
import {useGetBankByIdQuery} from "../banks/banksSlice";

const AddReceiverAccount = () => {
    const [loading, setLoading] = useState(false);  // State variable to track loading status
    const dispatch = useDispatch();
    const [createReceiverAccount] = useCreateReceiverAccountMutation();
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
        cardHolderNameRef: useRef(null),
        bankAccountNumberRef: useRef(null),
        bankNameRef: useRef(null),
        bankRef: useRef(null),
    };
    const theme = useTendaTheme();
    const [tickAnimationVisible, setTickAnimationVisible] = useState(false);
    const currentUser = useSelector(selectCurrentUser);
    const navigate = useNavigate();
    const receiverAccountFocus = useSelector(selectReceiverAccountFocus);
    const [selectedBankId, setSelectedBankId] = useState(null);
    const {data, isSuccess: bankFetchedSuccessfully} = useGetBankByIdQuery(selectedBankId);

    useEffect(() => {
        if (bankFetchedSuccessfully && selectedBankId > 0) {
            console.log("Data fetched : ", data?.bankName)
            if (data?.bankName !== "Other banks") {
                dispatch(setObjectItem({
                    key: "receiverAccountInputs",
                    innerKey: "bankName",
                    value: data?.bankName
                }));
                dispatch(setObjectItem({
                    key: "validReceiverAccount",
                    innerKey: "validBankName",
                    value: true
                }));
            }
        }
    }, [bankFetchedSuccessfully, data, dispatch, selectedBankId]);

    useEffect(() => {
        dispatch(setItem({key: 'title', value: 'Add Receiver Account'}));
        refs.receiverAccountNameRef?.current?.focus();

        dispatch(setObjectItem({
            key: "receiverAccountInputs",
            innerKey: "clientId",
            value: currentUser?.userId
        }));
        dispatch(setObjectItem({
            key: "validReceiverAccount",
            innerKey: "validClientId",
            value: true
        }));


    }, [currentUser?.userId, dispatch, refs.receiverAccountNameRef]);

    const handleAddAccountSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("receiverAccountName", receiverAccountInputs.receiverAccountName);
            formData.append("receiverAccountType", receiverAccountInputs.receiverAccountType);
            formData.append("clientId", currentUser?.userId);
            formData.append("receiverAccountIdentifier", receiverAccountInputs.receiverAccountType === ReceiverAccountType.BANK_ACCOUNT ? ReceiverAccountIdentifier.NONE :receiverAccountInputs.receiverAccountIdentifier);
            formData.append("qrCodeImage", receiverAccountInputs.qrCodeImage?.file || new Blob());
            formData.append("email", receiverAccountInputs.email);
            formData.append("phoneNumber", receiverAccountInputs.phoneNumber);
            formData.append("bankAccountNumber", receiverAccountInputs.bankAccountNumber || 0);
            formData.append("bankId", receiverAccountInputs.bankId || 0);
            formData.append("countryId", receiverAccountInputs.countryId || 0);
            formData.append("cardHolderName", receiverAccountInputs.cardHolderName);
            formData.append("bankName", receiverAccountInputs.bankName);

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

    const handleChangeReceiverAccountIdentifier = (receiverAccountIdentifier) => {
        dispatch(setObjectItem({
            key: 'receiverAccountInputs',
            innerKey: "receiverAccountIdentifier",
            value: receiverAccountIdentifier
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
                                    <ReceiverAccountTypeSelector
                                        ref={refs.topUpMethodRef}
                                        changeHandler={(selectedOption) => {
                                            return dispatch(handleValidation({
                                                objectName: "receiverAccount",
                                                eventValue: selectedOption.value,
                                                inputName: "receiverAccountType",
                                                regexPattern: "RECEIVER_ACCOUNT_TYPE_REGEX"
                                            }));
                                        }}
                                        validReceiverAccountType={validReceiverAccount.validReceiverAccountType}
                                        value={receiverAccountInputs.receiverAccountType}
                                        isFocused={receiverAccountFocus.receiverAccountTypeFocus}
                                        handleFocus={() => dispatch(handleFocus({
                                            objectName: 'receiverAccount',
                                            inputName: "receiverAccountType"
                                        }))}
                                        handleBlur={() => dispatch(handleBlur({
                                            objectName: 'receiverAccount',
                                            inputName: "receiverAccountType",
                                            regexPattern: "RECEIVER_ACCOUNT_TYPE_REGEX"
                                        }))}
                                    />

                                    {(receiverAccountInputs.receiverAccountType === ReceiverAccountType.ALIPAY_ACCOUNT ||
                                            receiverAccountInputs.receiverAccountType === ReceiverAccountType.WECHAT_ACCOUNT)
                                        && <>
                                            {<ReceiverAccountNameInput
                                                ref={refs.receiverAccountNameRef}
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

                                            {(receiverAccountInputs.receiverAccountIdentifier === ReceiverAccountIdentifier.EMAIL) &&
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
                                            {(receiverAccountInputs.receiverAccountIdentifier === ReceiverAccountIdentifier.PHONE_NUMBER) &&
                                                <PhoneNumberInput
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
                                            {(receiverAccountInputs.receiverAccountIdentifier === ReceiverAccountIdentifier.QR_CODE_IMAGE) &&
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

                                            {!(receiverAccountInputs.receiverAccountIdentifier === ReceiverAccountIdentifier.EMAIL) && (
                                                <Typography variant="body2" className="mt-3">
                                                    <Button
                                                        onClick={() => handleChangeReceiverAccountIdentifier(ReceiverAccountIdentifier.EMAIL)}
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

                                            {!(receiverAccountInputs.receiverAccountIdentifier === ReceiverAccountIdentifier.PHONE_NUMBER) && (
                                                <Typography variant="body2" className="mt-3">
                                                    <Button
                                                        onClick={() => handleChangeReceiverAccountIdentifier(ReceiverAccountIdentifier.PHONE_NUMBER)}
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

                                            {!(receiverAccountInputs.receiverAccountIdentifier === ReceiverAccountIdentifier.QR_CODE_IMAGE) && (
                                                <Typography variant="body2" className="mt-3">
                                                    <Button
                                                        onClick={() => handleChangeReceiverAccountIdentifier(ReceiverAccountIdentifier.QR_CODE_IMAGE)}
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
                                        </>
                                    }

                                    {receiverAccountInputs.receiverAccountType === ReceiverAccountType.BANK_ACCOUNT &&
                                        <>
                                            <BankSelector
                                                ref={refs.bankRef}
                                                changeHandler={(bankId) => {
                                                    setSelectedBankId(bankId);
                                                    return dispatch(handleValidation({
                                                        objectName: "receiverAccount",
                                                        eventValue: bankId,
                                                        inputName: "bankId",
                                                        regexPattern: "BANK_ID_REGEX"
                                                    }))
                                                }}
                                                countryName='China'
                                                validBank={validReceiverAccount.validBankId}
                                                value={receiverAccountInputs.bankId}
                                                isFocused={receiverAccountFocus.bankFocus}
                                                handleFocus={() => dispatch(handleFocus({
                                                    objectName: 'receiverAccount',
                                                    inputName: "bankId"
                                                }))}
                                                handleBlur={() => dispatch(handleBlur({
                                                    objectName: 'receiverAccount',
                                                    inputName: "bankId",
                                                    regexPattern: "BANK_ID_REGEX"
                                                }))}
                                            />
                                            {data?.bankNameEng === "Let me write my bank manually" && (
                                                <BankNameInput
                                                    ref={refs.bankNameRef}
                                                    changeHandler={(e) => dispatch(handleValidation({
                                                        objectName: "receiverAccount",
                                                        eventValue: e.target.value,
                                                        inputName: "bankName",
                                                        regexPattern: "BANK_NAME_REGEX"
                                                    }))}
                                                    validBankName={validReceiverAccount.validBankName}
                                                    value={receiverAccountInputs.bankName}
                                                    isFocused={receiverAccountFocus.bankNameFocus}
                                                    handleFocus={() => dispatch(handleFocus({
                                                        objectName: 'receiverAccount',
                                                        inputName: "bankName"
                                                    }))}
                                                    handleBlur={() => dispatch(handleBlur({
                                                        objectName: 'receiverAccount',
                                                        inputName: "bankName",
                                                        regexPattern: "BANK_NAME_REGEX"
                                                    }))}
                                                />
                                            )}
                                            <CardHolderNameInput
                                                ref={refs.cardHolderNameRef}
                                                changeHandler={(e) => dispatch(handleValidation({
                                                    objectName: "receiverAccount",
                                                    eventValue: e.target.value,
                                                    inputName: "cardHolderName",
                                                    regexPattern: "FULL_NAME_REGEX"
                                                }))}
                                                validCardHolderName={validReceiverAccount.validCardHolderName}
                                                value={receiverAccountInputs.cardHolderName}
                                                isFocused={receiverAccountFocus.cardHolderNameFocus}
                                                handleFocus={() => dispatch(handleFocus({
                                                    objectName: 'receiverAccount',
                                                    inputName: "cardHolderName"
                                                }))}
                                                handleBlur={() => dispatch(handleBlur({
                                                    objectName: 'receiverAccount',
                                                    inputName: "cardHolderName",
                                                    regexPattern: "FULL_NAME_REGEX"
                                                }))}
                                            />

                                            <BankAccountNumberInput
                                                ref={refs.bankAccountNumberRef}
                                                changeHandler={(e) => dispatch(handleValidation({
                                                    objectName: "receiverAccount",
                                                    eventValue: e.target.value,
                                                    inputName: "bankAccountNumber",
                                                    regexPattern: "BANK_ACCOUNT_NUMBER_REGEX"
                                                }))}
                                                validBankAccountNumber={validReceiverAccount.validBankAccountNumber}
                                                value={receiverAccountInputs.bankAccountNumber}
                                                isFocused={receiverAccountFocus.bankAccountNumberFocus}
                                                handleFocus={() => dispatch(handleFocus({
                                                    objectName: 'receiverAccount',
                                                    inputName: "bankAccountNumber"
                                                }))}
                                                handleBlur={() => dispatch(handleBlur({
                                                    objectName: 'receiverAccount',
                                                    inputName: "bankAccountNumber",
                                                    regexPattern: "BANK_ACCOUNT_NUMBER_REGEX"
                                                }))}
                                            />
                                        </>
                                    }


                                    <ErrorMessageComponent ref={refs.errorRef}/>

                                    {/* Submit Button */}
                                    <div className="d-grid">
                                        <TendaButton
                                            disabled={
                                                !Boolean(receiverAccountInputs.receiverAccountType?.trim()) ||
                                                ((receiverAccountInputs.receiverAccountType === ReceiverAccountType.ALIPAY_ACCOUNT ||
                                                        receiverAccountInputs.receiverAccountType === ReceiverAccountType.WECHAT_ACCOUNT)
                                                    && !((validReceiverAccount.validQrCodeImage || validReceiverAccount.validEmail || validReceiverAccount.validPhoneNumber) && validReceiverAccount.validReceiverAccountName && !eventProperties.isError))
                                                || (
                                                    receiverAccountInputs.receiverAccountType === ReceiverAccountType.BANK_ACCOUNT && !(
                                                        validReceiverAccount.validBankAccountNumber && validReceiverAccount.validCardHolderName && validReceiverAccount.validClientId && validReceiverAccount.validBankId
                                                        && !eventProperties.isError
                                                        && validReceiverAccount.validBankName
                                                    )
                                                )
                                            }
                                            buttonText={loading ? 'Adding account...' : 'Add account'}/>
                                    </div>
                                </form>
                            </div>
                        )}
                        {tickAnimationVisible &&
                            <TickAnimation successMessage="Receiver account created successfully!"/>}
                    </div>
                </section>
            </MainPageWrapper>
        </ThemeProvider>
    );
};

export default AddReceiverAccount;
