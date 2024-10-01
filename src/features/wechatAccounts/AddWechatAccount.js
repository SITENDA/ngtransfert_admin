import React, {useEffect, useRef, useState} from 'react';
import {Typography, message} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useLocation, Link} from 'react-router-dom';
import {
    selectValidWechatAccount,
    selectEventProperties,
    selectWechatAccountInputs,
    selectWechatAccountSpecifics,
    selectWechatAccountFocus,
    setItem,
    setObjectItem, selectCurrentUser, handleValidation, handleFocus, handleBlur,
} from "../auth/authSlice";
import {useCreateWechatAccountMutation} from "./wechatAccountsSlice";
import EmailInput from "../../components/form-controls/EmailInput";
import PhoneNumberInput from "../../components/form-controls/PhoneNumberInput";
import WechatAccountNameInput from "../../components/form-controls/WechatAccountNameInput";
import {
    initialWechatAccountInputs,
    initialValidWechatAccount,
    initialWechatAccountSpecifics,
    initialEventProperties,
} from "../../util/initials";
import ErrorMessageComponent from "../../components/form-controls/ErrorMessageComponent";
import TendaButton from "../../components/form-controls/TendaButton";
import {regex} from "../../util/regex";
import ClickToUpload from "../../components/form-controls/ClickToUpload";
import {adminPaths} from "../../util/frontend";
import TickAnimation from "../../components/TickAnimation";

const {Text} = Typography;

const AddWechatAccount = () => {
    const [wechatQrCodeImage, setWechatQrCodeImage] = useState({file: null, url: null});
    const [loading, setLoading] = useState(false);  // State variable to track loading status
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [createWechatAccount, {isSuccess}] = useCreateWechatAccountMutation();
    const wechatAccountSpecifics = useSelector(selectWechatAccountSpecifics);
    const validWechatAccount = useSelector(selectValidWechatAccount);
    const eventProperties = useSelector(selectEventProperties);
    const wechatAccountInputs = useSelector(selectWechatAccountInputs);
    const [tickAnimationVisible, setTickAnimationVisible] = useState(false);
    const refs = {
        wechatAccountNameRef: useRef(null),
        persistRef: useRef(null),
        emailRef: useRef(null),
        phoneNumberRef: useRef(null),
        errorRef: useRef(),
        wechatQrCodeRef: useRef(null),
    };
    const currentUser = useSelector(selectCurrentUser);
    const wechatAccountFocus = useSelector(selectWechatAccountFocus)
    useEffect(() => {
        dispatch(setItem({key: 'title', value: 'Add Wechat Account'}));
        const currentWechatAccountSpecifics = {...initialWechatAccountSpecifics, showQrCodeImage: true};
        dispatch(setItem({key: 'wechatAccountSpecifics', value: currentWechatAccountSpecifics}));
        refs.wechatAccountNameRef?.current?.focus();
    }, [dispatch, location.state, refs.wechatAccountNameRef]);

    useEffect(() => {
        const result = regex.EMAIL_REGEX.test(wechatAccountInputs.email);
        if (result) dispatch(setObjectItem({key: 'wechatAccountSpecifics', innerKey: "identifier", value: "email"}));
        dispatch(setObjectItem({key: 'validWechatAccount', innerKey: "validEmail", value: result}));
    }, [wechatAccountInputs.email, dispatch]);

    const handleFileChange = (e, setWechatQrCodeImage) => {
        const file = e.target.files[0];
        const currentImage = {file, url: URL.createObjectURL(file)};
        setWechatQrCodeImage(currentImage);
        dispatch(setObjectItem({key: 'wechatAccountInputs', innerKey: "wechatQrCodeImage", value: currentImage}));
        message.success(`${file.name} uploaded successfully.`);
    };

    const handleAddAccountSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("wechatAccountName", wechatAccountInputs.wechatAccountName);
            formData.append("clientId", currentUser?.userId);
            formData.append("wechatAccountIdentifier", wechatAccountSpecifics.identifier);
            formData.append("email", wechatAccountInputs.email);
            formData.append("phoneNumber", wechatAccountInputs.phoneNumber);

            // Append wechatQrCodeImage or an empty Blob if it is not defined
            formData.append("wechatQrCodeImage", wechatQrCodeImage?.file || new Blob());

            // Set loading to true when the request starts
            setLoading(true);
            const response = await createWechatAccount(formData).unwrap();
            if (response?.statusCode === 200 && response?.message === "WeChat account created successfully") {
                setTickAnimationVisible(true);
                reset();
                setTimeout(() => {
                    navigate(adminPaths.wechatAccountsPath);
                }, 2000);
            }

        } catch (error) {
            console.error('Error generating original QR code:', error);
        } finally {
            setLoading(false);  // Set loading to false when the request completes
        }
    };


    const handleUseEmail = () => {
        const currentwechatAccountSpecifics = {...initialWechatAccountSpecifics, showEmail: true};
        dispatch(setItem({key: 'wechatAccountSpecifics', value: currentwechatAccountSpecifics}));
        dispatch(setObjectItem({
            key: 'wechatAccountSpecifics',
            innerKey: "identifier",
            value: "email"
        }));
    };

    const handleUsePhoneNumber = () => {
        const currentwechatAccountSpecifics = {...initialWechatAccountSpecifics, showPhone: true};
        dispatch(setItem({key: 'wechatAccountSpecifics', value: currentwechatAccountSpecifics}));
        dispatch(setObjectItem({
            key: 'wechatAccountSpecifics',
            innerKey: "identifier",
            value: "phoneNumber"
        }));
    };

    const handleUseWechatQrCode = () => {
        const currentwechatAccountSpecifics = {...initialWechatAccountSpecifics, showQrCodeImage: true};
        dispatch(setItem({key: 'wechatAccountSpecifics', value: currentwechatAccountSpecifics}));
        dispatch(setObjectItem({
            key: 'wechatAccountSpecifics',
            innerKey: "identifier",
            value: "wechatQrCodeImage"
        }));
    };

    const reset = () => {
        dispatch(setItem({key: 'wechatAccountInputs', value: initialWechatAccountInputs}));
        dispatch(setItem({key: 'validWechatAccount', value: initialValidWechatAccount}));
        dispatch(setItem({key: 'wechatAccountSpecifics', value: initialWechatAccountSpecifics}));
        dispatch(setItem({key: 'eventProperties', value: initialEventProperties}));
    };

    return (
        <section id="login" className="container py-5" style={{height: '100vh'}}>
            <div className="row justify-content-center">
                {!tickAnimationVisible && (
                    <div className="col-lg-8">
                        <form onSubmit={handleAddAccountSubmit}>
                            {<WechatAccountNameInput
                                ref={refs.wechatAccountNameRef}
                                changeHandler={(e) => dispatch(handleValidation({
                                    objectName: "wechatAccount",
                                    eventValue: e.target.value,
                                    "inputName": "wechatAccountName",
                                    "regexPattern": "WECHAT_ACCOUNT_NAME_REGEX"
                                }))}
                                validWechatAccountName={validWechatAccount.validWechatAccountName}
                                value={wechatAccountInputs.wechatAccountName}
                                isFocused={wechatAccountFocus.wechatAccountNameFocus}
                                handleFocus={() => dispatch(handleFocus({
                                    objectName: 'wechatAccount',
                                    inputName: "wechatAccountName"
                                }))}
                                handleBlur={() => dispatch(handleBlur({
                                    inputsObject: wechatAccountInputs,
                                    objectName: 'wechatAccount',
                                    inputName: "wechatAccountName",
                                    regexPattern: "WECHAT_ACCOUNT_NAME_REGEX"
                                }))}
                            />
                            }
                            {wechatAccountSpecifics.showEmail &&
                                <EmailInput
                                    ref={refs.emailRef}
                                    changeHandler={(e) => dispatch(handleValidation({
                                        objectName: "wechatAccount",
                                        eventValue: e.target.value,
                                        "inputName": "email",
                                        "regexPattern": "EMAIL_REGEX"
                                    }))}
                                    validEmail={validWechatAccount.validEmail}
                                    value={wechatAccountInputs.email}
                                    isFocused={wechatAccountFocus.emailFocus}
                                    handleFocus={() => dispatch(handleFocus({
                                        objectName: 'wechatAccount',
                                        inputName: "email"
                                    }))}
                                    handleBlur={() => dispatch(handleBlur({
                                        inputsObject: wechatAccountInputs,
                                        objectName: 'wechatAccount',
                                        inputName: "email",
                                        regexPattern: "EMAIL_REGEX"
                                    }))}
                                />
                            }
                            {wechatAccountSpecifics.showPhone &&
                                <PhoneNumberInput
                                    ref={refs.phoneNumberRef}
                                    changeHandler={(e) => dispatch(handleValidation({
                                        objectName: "wechatAccount",
                                        eventValue: e,
                                        "inputName": "phoneNumber",
                                        "regexPattern": "PHONE_NUMBER_REGEX"
                                    }))}
                                    validPhoneNumber={validWechatAccount.validPhoneNumber}
                                    value={wechatAccountInputs.phoneNumber}
                                    focus={wechatAccountFocus.phoneNumberFocus}/>

                            }

                            {wechatAccountSpecifics.showQrCodeImage &&
                                <div style={{textAlign: 'center', height: '150px', maxHeight: '150px'}}>
                                    <label htmlFor="wechatQrCodeImage-upload"
                                           style={{cursor: 'pointer', display: 'block'}}>
                                        {wechatQrCodeImage.url ? <img src={wechatQrCodeImage.url} alt="Share 1"
                                                                      style={{width: '100px', height: '100px'}}/> :
                                            <ClickToUpload/>}
                                    </label>
                                    <input
                                        type="file"
                                        id="wechatQrCodeImage-upload"
                                        style={{display: 'none'}}
                                        onChange={(e) => handleFileChange(e, setWechatQrCodeImage)}
                                    />
                                </div>
                            }

                            {!wechatAccountSpecifics.showEmail && <p className="mt-3">
                                <Link onClick={handleUseEmail}
                                      style={{
                                          textDecoration: "none",
                                          fontStyle: "italic",
                                          color: "white",
                                          fontSize: '1rem'
                                      }}>
                                    Use email instead</Link>
                            </p>}

                            {!wechatAccountSpecifics.showPhone && <p className="mt-3">
                                <Link onClick={handleUsePhoneNumber}
                                      style={{
                                          textDecoration: "none",
                                          fontStyle: "italic",
                                          color: "white",
                                          fontSize: '1rem'
                                      }}>
                                    Use phone number instead</Link>
                            </p>}

                            {!wechatAccountSpecifics.showQrCodeImage && <p className="mt-3">
                                <Link onClick={handleUseWechatQrCode}
                                      style={{
                                          textDecoration: "none",
                                          fontStyle: "italic",
                                          color: "white",
                                          fontSize: '1rem'
                                      }}>
                                    Use Wechat QR Code</Link>
                            </p>}

                            <ErrorMessageComponent ref={refs.errorRef}/>

                            {/* Submit Button */}
                            <div className="d-grid">
                                <TendaButton
                                    disabled={!((wechatQrCodeImage.file || validWechatAccount.validEmail || validWechatAccount.validPhoneNumber) && validWechatAccount.validWechatAccountName && !eventProperties.isError)}
                                    buttonText={loading ? 'Adding account...' : 'Add account'}/>
                            </div>
                        </form>
                    </div>
                )}
                {tickAnimationVisible && <TickAnimation successMessage="Wechat account created successfully!"/>}
            </div>
        </section>
    );
};

export default AddWechatAccount;
