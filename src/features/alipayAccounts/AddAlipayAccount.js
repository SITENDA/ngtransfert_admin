import React, {useEffect, useRef, useState} from 'react';
import {message} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation, Link, useNavigate} from 'react-router-dom';
import {
    selectValidAlipayAccount,
    selectEventProperties,
    selectAlipayAccountInputs,
    selectAlipayAccountSpecifics,
    selectAlipayAccountFocus,
    setItem,
    setObjectItem, selectCurrentUser, handleValidation, handleFocus, handleBlur,
} from "../auth/authSlice";
import {useCreateAlipayAccountMutation} from "./alipayAccountsSlice";
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
import ClickToUpload from "../../components/form-controls/ClickToUpload";
import TickAnimation from "../../components/TickAnimation";
import { adminPaths } from "../../util/frontend";

const AddAlipayAccount = () => {
    const [alipayQrCodeImage, setAlipayQrCodeImage] = useState({file: null, url: null});
    const [loading, setLoading] = useState(false);  // State variable to track loading status
    const dispatch = useDispatch();
    const location = useLocation();
    const [createAlipayAccount, {isSuccess}] = useCreateAlipayAccountMutation();
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

    const handleFileChange = (e, setAlipayQrCodeImage) => {
        const file = e.target.files[0];
        const currentImage = {file, url: URL.createObjectURL(file)};
        setAlipayQrCodeImage(currentImage);
        dispatch(setObjectItem({key: 'alipayAccountInputs', innerKey: "alipayQrCodeImage", value: currentImage}));
        message.success(`${file.name} uploaded successfully.`);
    };

    const handleAddAccountSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("alipayAccountName", alipayAccountInputs.alipayAccountName);
            formData.append("clientId", currentUser?.userId);
            formData.append("alipayAccountIdentifier", alipayAccountSpecifics.identifier);
            formData.append("email", alipayAccountInputs.email);
            formData.append("phoneNumber", alipayAccountInputs.phoneNumber);
            formData.append("alipayQrCodeImage", alipayQrCodeImage?.file || new Blob());

            // Set loading to true when the request starts
            setLoading(true);
            const response = await createAlipayAccount(formData).unwrap();
            if (response?.statusCode === 200 && response?.message === "Alipay account created successfully") {
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
                                <div style={{textAlign: 'center', height: '150px', maxHeight: '150px'}}>
                                    <label htmlFor="alipayQrCodeImage-upload"
                                           style={{cursor: 'pointer', display: 'block'}}>
                                        {alipayQrCodeImage.url ? <img src={alipayQrCodeImage.url} alt="Share 1"
                                                                      style={{width: '100px', height: '100px'}}/> :
                                            <ClickToUpload/>}
                                    </label>
                                    <input
                                        type="file"
                                        id="alipayQrCodeImage-upload"
                                        style={{display: 'none'}}
                                        onChange={(e) => handleFileChange(e, setAlipayQrCodeImage)}
                                    />
                                </div>
                            }

                            {!alipayAccountSpecifics.showEmail && <p className="mt-3">
                                <Link onClick={handleUseEmail}
                                      style={{
                                          textDecoration: "none",
                                          fontStyle: "italic",
                                          color: "white",
                                          fontSize: '1rem'
                                      }}>
                                    Use email instead</Link>
                            </p>}

                            {!alipayAccountSpecifics.showPhone && <p className="mt-3">
                                <Link onClick={handleUsePhoneNumber}
                                      style={{
                                          textDecoration: "none",
                                          fontStyle: "italic",
                                          color: "white",
                                          fontSize: '1rem'
                                      }}>
                                    Use phone number instead</Link>
                            </p>}

                            {!alipayAccountSpecifics.showQrCodeImage && <p className="mt-3">
                                <Link onClick={handleUseAlipayQrCode}
                                      style={{
                                          textDecoration: "none",
                                          fontStyle: "italic",
                                          color: "white",
                                          fontSize: '1rem'
                                      }}>
                                    Use Alipay QR Code</Link>
                            </p>}

                            <ErrorMessageComponent ref={refs.errorRef}/>

                            {/* Submit Button */}
                            <div className="d-grid">
                                <TendaButton
                                    disabled={!((alipayQrCodeImage.file || validAlipayAccount.validEmail || validAlipayAccount.validPhoneNumber) && validAlipayAccount.validAlipayAccountName && !eventProperties.isError)}
                                    buttonText={loading ? 'Adding account...' : 'Add account'}/>
                            </div>
                        </form>
                    </div>
                )}
                {tickAnimationVisible && <TickAnimation successMessage="Alipay account created successfully!"/>}
            </div>
        </section>
    );
};

export default AddAlipayAccount;
