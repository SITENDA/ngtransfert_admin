import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useLocation} from 'react-router-dom';
import {
    selectEventProperties,
    setItem,
    selectCurrentUser,
    handleValidation,
    handleFocus,
    handleBlur,
    setObjectItem,
    selectValidTransferRequest, selectTransferRequestInputs, selectTransferRequestFocus,
} from "../auth/authSlice";
import {
    initialBankAccountInputs, initialTransferRequestFocus, initialTransferRequestInputs,
    initialValidBankAccount, initialValidTransferRequest,
} from "../../util/initials";
import ErrorMessageComponent from "../../components/form-controls/ErrorMessageComponent";
import TendaButton from "../../components/form-controls/TendaButton";
import TickAnimation from "../../components/TickAnimation";
import CountrySelector from "../../components/form-controls/CountrySelector";
import MainPageWrapper from "../../components/MainPageWrapper";
import AmountInput from "../../components/form-controls/AmountInput";
import RateInput from "../../components/form-controls/RateInput";
import RemarkInput from "../../components/form-controls/RemarkInput";
import ReceiverAccountType from "../../util/ReceiverAccountType";
import {useCreateTransferRequestMutation} from "./transferRequestsSlice";
import {adminPaths} from "../../util/frontend";
import CurrencySelector from "../../components/form-controls/CurrencySelector";

const ApplyForTransfer = () => {
    const [loading, setLoading] = useState(false);  // State variable to track loading status
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [createTransferRequest] = useCreateTransferRequestMutation();
    const eventProperties = useSelector(selectEventProperties);
    const refs = {
        currencyIdRef: useRef(null),
        amountRef: useRef(null),
        rateRef: useRef(null),
        remarkRef: useRef(null),
        receiverAccountTypeRef: useRef(null),
        receiverAccountIdRef: useRef(null),
        clientIdRef: useRef(null),
        countryOfDepositIdRef: useRef(null),
        errorRef: useRef(null),
    };
    const currentUser = useSelector(selectCurrentUser);
    const transferRequestInputs = useSelector(selectTransferRequestInputs);
    const validTransferRequest = useSelector(selectValidTransferRequest)
    const transferRequestFocus = useSelector(selectTransferRequestFocus)
    const [tickAnimationVisible, setTickAnimationVisible] = useState(false);

    useEffect(() => {
        dispatch(setItem({key: 'title', value: 'Apply for a money transfer'}));
        refs.countryOfDepositIdRef?.current.focus();
        const wechatAccount = location.state?.wechatAccount
        const alipayAccount = location.state?.alipayAccount
        const bankAccount = location.state?.bankAccount
        dispatch(setObjectItem({
            key: 'transferRequestInputs',
            innerKey: "receiverAccountId",
            value: wechatAccount ? wechatAccount?.wechatAccountId : alipayAccount ? alipayAccount?.alipayAccountId : bankAccount ? bankAccount.bankAccountId : null,
        }));
        dispatch(setObjectItem({
            key: 'transferRequestInputs',
            innerKey: "receiverAccountType",
            value: wechatAccount ? ReceiverAccountType.WECHAT_ACCOUNT : alipayAccount ? ReceiverAccountType.ALIPAY_ACCOUNT : bankAccount ? ReceiverAccountType.BANK_ACCOUNT : null,
        }));
        dispatch(setObjectItem({key: 'validTransferRequest', innerKey: "validReceiverAccountType", value: true}));
        dispatch(setObjectItem({key: 'validTransferRequest', innerKey: "validReceiverAccountId", value: true}));
        dispatch(setObjectItem({key: 'validTransferRequest', innerKey: "validClientId", value: true}));
        dispatch(setObjectItem({key: 'transferRequestInputs', innerKey: "clientId", value: currentUser?.userId}));
        dispatch(setObjectItem({key: 'eventProperties', innerKey: "isError", value: false}));
    }, [currentUser?.userId, dispatch, location.state, refs.countryOfDepositIdRef]);

    const handleAddAccountSubmit = async (e) => {
        e.preventDefault();

        try {
            const requestData = {
                amount: Number(transferRequestInputs.amount),
                currencyId: transferRequestInputs.currencyId,
                rate: Number(transferRequestInputs.rate),
                remark: transferRequestInputs.remark,
                receiverAccountType: transferRequestInputs.receiverAccountType,
                receiverAccountId: transferRequestInputs.receiverAccountId,
                clientId: currentUser?.userId,
                countryOfDepositId: transferRequestInputs.countryOfDepositId,
            };

            setLoading(true);
            const response = await createTransferRequest(requestData).unwrap();
            if (response?.statusCode === 200 && response.message === "Transfer request saved successfully") {
                setTickAnimationVisible(true);
                reset();
                setTimeout(() => {
                    navigate(adminPaths.transferRequestsPath);
                }, 2000);
            }
        } catch (error) {
            console.error('Error processing transfer request:', error);
        } finally {
            dispatch(setItem({key: 'transferRequestInputs', value: initialTransferRequestInputs}));
            dispatch(setItem({key: 'validTransferRequest', value: initialValidTransferRequest}));
            dispatch(setItem({key: 'transferRequestFocus', value: initialTransferRequestFocus}));
            setLoading(false);
        }
    };

    const reset = () => {
        dispatch(setItem({key: 'transferRequestInputs', value: initialBankAccountInputs}));
        dispatch(setItem({key: 'validTransferRequest', value: initialValidBankAccount}));
    };


    return (
        <MainPageWrapper>
            <section id="login" className="container py-5" style={{height: '100vh'}}>
                <div className="row justify-content-center">
                    {!tickAnimationVisible && (
                        <div className="col-lg-8">
                            <form onSubmit={handleAddAccountSubmit}>

                                <CountrySelector
                                    ref={refs.countryOfDepositIdRef}
                                    changeHandler={(countryOfDepositId) => dispatch(handleValidation({
                                        objectName: "transferRequest",
                                        eventValue: countryOfDepositId,
                                        inputName: "countryOfDepositId",
                                        regexPattern: "COUNTRY_ID_REGEX"
                                    }))}
                                    label="Country of deposit"
                                    validCountry={validTransferRequest.validCountryOfDepositId}
                                    value={transferRequestInputs.countryOfDepositId}
                                    isFocused={transferRequestFocus.countryOfDepositIdFocus}
                                    handleFocus={() => dispatch(handleFocus({
                                        objectName: 'transferRequest',
                                        inputName: "countryOfDepositId"
                                    }))}
                                    handleBlur={() => dispatch(handleBlur({
                                        objectName: 'transferRequest',
                                        inputName: "countryOfDepositId",
                                        regexPattern: "COUNTRY_ID_REGEX"
                                    }))}
                                />

                                {transferRequestInputs.countryOfDepositId > 0 &&
                                    <CurrencySelector
                                    ref={refs.currencyIdRef}
                                    changeHandler={(currencyId) => dispatch(handleValidation({
                                        objectName: "transferRequest",
                                        eventValue: currencyId,
                                        inputName: "currencyId",
                                        regexPattern: "CURRENCY_ID_REGEX"
                                    }))}
                                    validCurrency={validTransferRequest.validCurrencyId}
                                    value={transferRequestInputs.currencyId}
                                    countryOfDepositId={transferRequestInputs.countryOfDepositId}
                                    isFocused={transferRequestFocus.currencyIdFocus}
                                    handleFocus={() => dispatch(handleFocus({
                                        objectName: 'transferRequest',
                                        inputName: "currencyId"
                                    }))}
                                    handleBlur={() => dispatch(handleBlur({
                                        objectName: 'transferRequest',
                                        inputName: "currencyId",
                                        regexPattern: "CURRENCY_ID_REGEX"
                                    }))}
                                />}

                                <AmountInput
                                    ref={refs.amountRef}
                                    changeHandler={(e) => dispatch(handleValidation({
                                        objectName: "transferRequest",
                                        eventValue: e.target.value,
                                        inputName: "amount",
                                        regexPattern: "AMOUNT_REGEX"
                                    }))}
                                    validAmount={validTransferRequest.validAmount}
                                    value={transferRequestInputs.amount}
                                    isFocused={transferRequestFocus.amountFocus}
                                    handleFocus={() => dispatch(handleFocus({
                                        objectName: 'transferRequest',
                                        inputName: "amount"
                                    }))}
                                    handleBlur={() => dispatch(handleBlur({
                                        objectName: 'transferRequest',
                                        inputName: "amount",
                                        regexPattern: "AMOUNT_REGEX"
                                    }))}
                                />

                                <RateInput
                                    ref={refs.rateRef}
                                    changeHandler={(e) => dispatch(handleValidation({
                                        objectName: "transferRequest",
                                        eventValue: e.target.value,
                                        inputName: "rate",
                                        regexPattern: "RATE_REGEX"
                                    }))}
                                    validRate={validTransferRequest.validRate}
                                    value={transferRequestInputs.rate}
                                    isFocused={transferRequestFocus.rateFocus}
                                    handleFocus={() => dispatch(handleFocus({
                                        objectName: 'transferRequest',
                                        inputName: "rate"
                                    }))}
                                    handleBlur={() => dispatch(handleBlur({
                                        objectName: 'transferRequest',
                                        inputName: "rate",
                                        regexPattern: "RATE_REGEX"
                                    }))}
                                />

                                <RemarkInput
                                    ref={refs.remarkRef}
                                    changeHandler={(e) => dispatch(handleValidation({
                                        objectName: "transferRequest",
                                        eventValue: e.target.value,
                                        inputName: "remark",
                                        regexPattern: "REMARK_REGEX"
                                    }))}
                                    validRemark={validTransferRequest.validRemark}
                                    value={transferRequestInputs.remark}
                                    isFocused={transferRequestFocus.remarkFocus}
                                    handleFocus={() => dispatch(handleFocus({
                                        objectName: 'transferRequest',
                                        inputName: "remark"
                                    }))}
                                    handleBlur={() => dispatch(handleBlur({
                                        objectName: 'transferRequest',
                                        inputName: "remark",
                                        regexPattern: "REMARK_REGEX"
                                    }))}
                                />
                                <ErrorMessageComponent ref={refs.errorRef}/>


                                {/* Submit Button */}
                                <div className="d-grid">
                                    <TendaButton
                                        disabled={!(
                                            validTransferRequest.validCountryOfDepositId &&
                                            validTransferRequest.validRate &&
                                            validTransferRequest.validClientId &&
                                            validTransferRequest.validReceiverAccountId &&
                                            validTransferRequest.validReceiverAccountType &&
                                            validTransferRequest.validRemark &&
                                            validTransferRequest.validCurrencyId &&
                                            validTransferRequest.validAmount
                                        ) || eventProperties.isError}
                                        buttonText={loading ? 'Requesting transfer...' : 'Request Transfer'}
                                    />
                                </div>

                            </form>
                        </div>
                    )}
                    {tickAnimationVisible && <TickAnimation successMessage="Transfer requested successfully!"/>}
                </div>
            </section>
        </MainPageWrapper>
    );
};

export default ApplyForTransfer;
