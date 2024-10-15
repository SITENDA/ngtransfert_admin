import React, {useEffect, useRef, useState} from 'react';
import {Typography, Button, Grid, Card, CardContent, Divider, CircularProgress} from '@mui/material';
import {darkColor, lightColor} from "../../util/initials";
import ImageDisplay from "../../components/form-controls/ImageDisplay";
import TickAnimation from "../../components/TickAnimation";
import MainPageWrapper from "../../components/MainPageWrapper";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    handleBlur,
    handleFocus, handleImageChange,
    handleValidation, isValidNumber, isValidString,
    selectIsDarkTheme, selectTopUpFocus,
    selectTopUpInputs, selectValidTopUp,
    setItem, setObjectItem
} from "../auth/authSlice";
import AmountInput from "../../components/form-controls/AmountInput";
import {useGetCountryByCountryNameQuery} from "../countries/countriesSlice";
import {orderedTopUpMethods} from "../../util/TopUpMethod";
import SelectedMethodDisplay from "../../components/form-controls/SelectedMethodDisplay";
import {useDoCurrencyExchangeMutation, useTopUpAccountBalanceMutation} from "./topUpSlice";
import ImageInput from "../../components/form-controls/ImageInput";
import {adminPaths} from "../../util/frontend";

const TopUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const receiverAccount = location?.state?.receiverAccount;

    const isDarkTheme = useSelector(selectIsDarkTheme);
    const topUpInputs = useSelector(selectTopUpInputs)
    const validTopUp = useSelector(selectValidTopUp)
    const topUpFocus = useSelector(selectTopUpFocus)

    const [tickAnimationVisible, setTickAnimationVisible] = useState(false);
    const [directionOfExchange, setDirectionOfExchange] = useState("forward");
    const [canSubmit, setCanSubmit] = useState(false);
    const [isTypingForward, setIsTypingForward] = useState(false);
    const [isTypingBackward, setIsTypingBackward] = useState(false);
    const [countryOfDeposit, setCountryOfDeposit] = useState(null);
    const [sourceCurrencyCode, setSourceCurrencyCode] = useState(null);
    const [exchangeData, setExchangeData] = useState(null);

    const stateSelectedMethod = location.state.selectedMethod;
    const foundMethod = orderedTopUpMethods.find(method => method.value === stateSelectedMethod);
    const selectedMethod = {...foundMethod, label: <SelectedMethodDisplay orderedReceiverAccountType={foundMethod}/>};
    const selectedCountryName = location.state.selectedCountryName;
    const [topUpAccountBalance, {isLoading: topUpLoading, isSuccess: topUpIsSuccessful, isError: topUpHasError, error}] = useTopUpAccountBalanceMutation();

    const {data: countryData, isSuccess: countryFetched} = useGetCountryByCountryNameQuery(selectedCountryName);

    const [doCurrencyExchange, {
        data: currencyExchangeData,
        isLoading,
        isSuccess,
        isError
    }] = useDoCurrencyExchangeMutation();

    useEffect(() => {
        setCanSubmit(false);
        setIsTypingForward(false);
        setIsTypingBackward(false);
    }, [isSuccess, isError]);

    useEffect(() => {
        if (countryFetched && countryData?.data?.country) {
            setCountryOfDeposit(countryData?.data?.country)
            setSourceCurrencyCode(countryData?.data?.country?.currency?.currencyCode)
            dispatch(setObjectItem({
                key: "topUpInputs",
                innerKey: "sourceCurrencyCode",
                value: countryData?.data?.country?.currency?.currencyCode
            }))
        }
    }, [countryData, countryFetched, countryOfDeposit, dispatch]);


    const refs = {
        topUpMethodRef: useRef(null),
        currencyIdRef: useRef(null),
        sourceAmountRef: useRef(null),
        targetAmountRef: useRef(null),
        proofPictureRef: useRef(null),
    }

    useEffect(() => {
        dispatch(setItem({key: "title", value: "Top Up"}));
    }, [dispatch]);

    const handleChange = () => {
        const handleCurrencyExchange = async () => {
            if ((isValidNumber(topUpInputs.sourceAmount) || isValidNumber(topUpInputs.targetAmount)) &&
                isValidNumber(countryOfDeposit?.countryId) &&
                isValidString(topUpInputs.sourceCurrencyCode) &&
                isValidString(topUpInputs.targetCurrencyCode)) {

                try {
                    // Trigger the mutation with the appropriate arguments
                    await doCurrencyExchange({
                        sourceCurrencyCode: topUpInputs.sourceCurrencyCode,
                        targetCurrencyCode: topUpInputs.targetCurrencyCode,
                        sourceAmount: topUpInputs.sourceAmount || 0,
                        targetAmount: topUpInputs.targetAmount || 0,
                        countryId: countryOfDeposit?.countryId || 1,  // Fallback for testing
                        directionOfExchange: directionOfExchange,
                    }).unwrap();

                    // Dispatch updated amounts based on direction
                    if (directionOfExchange === "forward") {
                        dispatch(setObjectItem({
                            key: "topUpInputs",
                            innerKey: "targetAmount",
                            value: currencyExchangeData?.targetAmount
                        }));
                    } else {
                        dispatch(setObjectItem({
                            key: "topUpInputs",
                            innerKey: "sourceAmount",
                            value: currencyExchangeData?.sourceAmount
                        }));
                    }
                    setExchangeData(currencyExchangeData);

                } catch (exception) {
                    console.log("Error is: ", exception);
                }
            } else {
                console.log("One of the inputs is still invalid");
            }
        };
        // Start a timer to reset isTyping to true after 3 seconds
        const timer = setTimeout(() => {
            setCanSubmit(true); // Set isTyping to false
            if (isTypingForward || isTypingBackward) {
                handleCurrencyExchange(); // Trigger the exchange only after isTyping is true
            }
            setCanSubmit(false);
        }, 3000); // 3-second debounce delay

        // Clear the timeout if isTyping changes again within the delay
        return () => clearTimeout(timer);
    }

    useEffect(handleChange, [
        canSubmit,
        countryOfDeposit?.countryId,
        topUpInputs.sourceCurrencyCode,
        topUpInputs.targetCurrencyCode,
        dispatch,
        doCurrencyExchange,
        sourceCurrencyCode,
        topUpInputs.sourceAmount,
        directionOfExchange,
    ]);

    useEffect(handleChange, [
        canSubmit,
        countryOfDeposit?.countryId,
        topUpInputs.sourceCurrencyCode,
        topUpInputs.targetCurrencyCode,
        dispatch,
        doCurrencyExchange,
        sourceCurrencyCode,
        topUpInputs.targetAmount,
        directionOfExchange,
    ]);


    const handleConfirmTopUp = async (e) => {
        e.preventDefault();
        try {
            const topUpData = new FormData();
            topUpData.append("receiverAccountType", receiverAccount?.receiverAccountType);
            topUpData.append("accountIdentifier", receiverAccount?.accountIdentifier);
            topUpData.append("accountId", receiverAccount?.accountId);
            topUpData.append("currency", topUpInputs?.targetCurrencyCode);
            topUpData.append("amountInRMB", topUpInputs?.targetAmount);
            topUpData.append("proofPicture", topUpInputs.proofPicture?.file || new Blob());

            // Set loading to true when the request starts
            const response = await topUpAccountBalance(topUpData).unwrap();
            if (response?.statusCode === 200 && response?.message === "Top Up Requested successfully") {
                setTickAnimationVisible(true);
                setTimeout(() => {
                    navigate(adminPaths.alipayAccountsPath);
                }, 2000);
            }
        } catch (error) {
            console.error('Error topping up:', error);
        } finally {
           // setLoading(false);  // Set loading to false when the request completes
        }
    };

    return (
        <MainPageWrapper>
            <section className="container py-5" style={{
                background: isDarkTheme ? darkColor : lightColor,
                color: isDarkTheme ? lightColor : darkColor
            }}>
                <Grid container justifyContent="center">
                    {!tickAnimationVisible && (
                        <>
                            <Grid item xs={12} md={8}>
                                <Card sx={{
                                    background: isDarkTheme ? darkColor : lightColor,
                                    color: isDarkTheme ? lightColor : darkColor
                                }}>
                                    <CardContent>
                                        <Grid container sx={{mb: 2}}>
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Country
                                                    :</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <ImageDisplay
                                                    imageUrl={countryOfDeposit?.countryFlagUrl}
                                                    title={`${countryOfDeposit?.countryName} Flag`}/>
                                                <Typography variant="h6"
                                                            sx={{fontWeight: 'normal'}}>{countryOfDeposit?.countryName}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Divider sx={{mb: 2}}/>
                                        <Grid container sx={{mb: 2}}>
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Method :</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography variant="h6"
                                                            sx={{fontWeight: 'normal'}}>{selectedMethod.label}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Divider sx={{mb: 2}}/>

                                        {exchangeData?.adminRate && <Grid container sx={{mb: 2}}>
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Rate :</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography variant="h6"
                                                            sx={{fontWeight: 'normal'}}>{exchangeData?.adminRate}</Typography>
                                            </Grid>
                                        </Grid>}
                                    </CardContent>

                                    {validTopUp.validCountryOfTopUpId && validTopUp.validTopUpMethod &&
                                        <>
                                            <Divider sx={{mb: 2}}/>
                                            {(directionOfExchange === "backward") && (isLoading || isTypingBackward) ? (
                                                <CircularProgress size={15}/>
                                            ) : (<AmountInput
                                                ref={refs.sourceAmountRef}
                                                changeHandler={(e) => {
                                                    setCanSubmit(false)
                                                    setDirectionOfExchange("forward")
                                                    setIsTypingForward(true)
                                                    if (e.target.value === 0) {
                                                        dispatch(setObjectItem({
                                                            key: "topUpInputs",
                                                            innerKey: "targetAmount",
                                                            value: 0
                                                        }))
                                                    }
                                                    dispatch(handleValidation({
                                                        objectName: "topUp",
                                                        eventValue: e.target.value,
                                                        inputName: "sourceAmount",
                                                        regexPattern: "AMOUNT_REGEX"
                                                    }))
                                                    return dispatch(handleValidation({
                                                        objectName: "topUp",
                                                        eventValue: topUpInputs.targetAmount,
                                                        inputName: "targetAmount",
                                                        regexPattern: "AMOUNT_REGEX"
                                                    }))
                                                }}
                                                validAmount={validTopUp.validSourceAmount}
                                                value={topUpInputs.sourceAmount}
                                                label={countryOfDeposit?.currency?.currencyCode ? `Amount in ${countryOfDeposit?.currency?.currencyCode}` : "Amount"}
                                                isFocused={topUpFocus.sourceAmountFocus}
                                                handleFocus={() => dispatch(handleFocus({
                                                    objectName: 'topUp',
                                                    inputName: "sourceAmount"
                                                }))}
                                                handleBlur={() => dispatch(handleBlur({
                                                    objectName: 'topUp',
                                                    inputName: "sourceAmount",
                                                    regexPattern: "AMOUNT_REGEX"
                                                }))}/>)}

                                            <Divider sx={{mb: 2}}/>
                                            {(directionOfExchange === "forward") && (isLoading || isTypingForward) ? (
                                                <CircularProgress size={15}/>
                                            ) : (<AmountInput
                                                ref={refs.targetAmountRef}
                                                changeHandler={(e) => {
                                                    setCanSubmit(false)
                                                    setDirectionOfExchange("backward")
                                                    setIsTypingBackward(true)
                                                    if (e.target.value === 0) {
                                                        dispatch(setObjectItem({
                                                            key: "topUpInputs",
                                                            innerKey: "sourceAmount",
                                                            value: 0
                                                        }))
                                                    }

                                                    dispatch(handleValidation({
                                                        objectName: "topUp",
                                                        eventValue: e.target.value,
                                                        inputName: "targetAmount",
                                                        regexPattern: "AMOUNT_REGEX"
                                                    }));
                                                    return dispatch(handleValidation({
                                                        objectName: "topUp",
                                                        eventValue: topUpInputs.sourceAmount,
                                                        inputName: "sourceAmount",
                                                        regexPattern: "AMOUNT_REGEX"
                                                    }))
                                                }}
                                                validAmount={validTopUp.validTargetAmount}
                                                value={topUpInputs.targetAmount}
                                                label="Amount in CNY"
                                                isFocused={topUpFocus.targetAmountFocus}
                                                handleFocus={() => {
                                                    return dispatch(handleFocus({
                                                        objectName: 'topUp',
                                                        inputName: "targetAmount"
                                                    }))
                                                }
                                                }
                                                handleBlur={() => dispatch(handleBlur({
                                                    objectName: 'topUp',
                                                    inputName: "targetAmount",
                                                    regexPattern: "AMOUNT_REGEX"
                                                }))}/>)}

                                            <Divider sx={{mb: 2}}/>

                                            <ImageInput
                                                handleImageChange={(e) => dispatch(handleImageChange({
                                                    objectName: "topUp",
                                                    file: e.target.files[0],
                                                    inputName: "proofPicture",
                                                    regexPattern: "UPLOAD_IMAGE_URL_REGEX",
                                                }))}
                                                image={topUpInputs.proofPicture} label="Picture of proof"/>

                                        </>

                                    }
                                    {(validTopUp.validSourceAmount || validTopUp.validTargetAmount) &&
                                        validTopUp.validTopUpMethod &&
                                        validTopUp.validCountryOfTopUpId &&
                                        validTopUp.validProofPicture &&
                                        <>
                                            <Divider sx={{mb: 2}}/>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleConfirmTopUp}
                                                disabled={!selectedMethod}
                                                style={{marginTop: '20px'}}
                                            >
                                                Confirm Top-Up
                                            </Button>
                                        </>
                                    }
                                </Card>
                            </Grid>
                        </>
                    )}
                </Grid>
                {tickAnimationVisible && <TickAnimation successMessage="Top Up Requested successfully!"/>}
            </section>
        </MainPageWrapper>
    );
};

export default TopUp;