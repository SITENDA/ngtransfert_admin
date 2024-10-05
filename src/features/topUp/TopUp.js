import React, {useEffect, useRef, useState} from 'react';
import {Typography, Button, Grid, Card, CardActions, CardContent, Divider, Box} from '@mui/material';
import TopUpMethodSelector from "../../components/form-controls/TopUpMethodSelector";
import {darkColor, lightColor} from "../../util/initials";
import SendIcon from "@mui/icons-material/Send";
import EmailDisplay from "../../components/form-controls/EmailDisplay";
import PhoneNumberDisplay from "../../components/form-controls/PhoneNumberDisplay";
import ImageDisplay from "../../components/form-controls/ImageDisplay";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DeleteIcon from "@mui/icons-material/Delete";
import TickAnimation from "../../components/TickAnimation";
import MainPageWrapper from "../../components/MainPageWrapper";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    handleBlur,
    handleFocus,
    handleValidation,
    selectIsDarkTheme, selectTopUpFocus,
    selectTopUpInputs, selectValidTopUp,
    setItem
} from "../auth/authSlice";
import {useDeleteAlipayAccountMutation} from "../alipayAccounts/alipayAccountsSlice";
import AmountInput from "../../components/form-controls/AmountInput";
import CurrencySelector from "../../components/form-controls/CurrencySelector";
import {useGetCountryByCountryNameQuery} from "../countries/countriesSlice";
import {orderedTopUpMethods} from "../../util/TopUpMethod";
import SelectedMethodDisplay from "../../components/form-controls/SelectedMethodDisplay";
import {topUpApiSlice, useDoCurrencyExchangeMutation} from "./topUpSlice";

const TopUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const [deleteAlipayAccount] = useDeleteAlipayAccountMutation();
    const [tickAnimationVisible, setTickAnimationVisible] = useState(false);

    const alipayAccount = location?.state?.alipayAccount;
    const wechatAccount = location?.state?.wechatAccount;
    const bankAccount = location?.state?.bankAccount;
    const stateSelectedMethod = location.state.selectedMethod;
    const foundMethod = orderedTopUpMethods.find(method => method.value === stateSelectedMethod);
    const selectedMethod = {...foundMethod, label: <SelectedMethodDisplay method={foundMethod}/>};
    const selectedCountryName = location.state.selectedCountryName;

    const topUpInputs = useSelector(selectTopUpInputs)
    const validTopUp = useSelector(selectValidTopUp)
    const topUpFocus = useSelector(selectTopUpFocus)

    const {data: countryData, isSuccess: countryFetched} = useGetCountryByCountryNameQuery(selectedCountryName);
    const [countryOfDeposit, setCountryOfDeposit] = useState(null);
    const [targetCurrencyCode, setTargetCurrencyCode] = useState("CNY");
    const [sourceCurrencyCode, setSourceCurrencyCode] = useState(null);


    // const {
    //     data: currencyExchangeData,
    //     isSuccess: isCurrencyDataSuccessful,
    //     isError: isCurrencyDataError,
    //     error: currencyDataError,
    // } =
    //     useDoCurrencyExchangeQuery(sourceCurrencyCode, targetCurrencyCode, topUpInputs.amount, countryOfDeposit?.countryId);

    // useEffect(() => {
    //     if (isCurrencyDataSuccessful) {
    //         console.log("Currency data fetched : ", currencyExchangeData);
    //     } else if (isCurrencyDataError) {
    //         console.log("Currency data error : ", currencyDataError);
    //         console.log("countryOfDeposit : ", countryOfDeposit)
    //     }
    // }, [countryOfDeposit, currencyDataError, currencyExchangeData, isCurrencyDataError, isCurrencyDataSuccessful]);

    const [doCurrencyExchange, {
        data: currencyExchangeData,
        isLoading,
        isSuccess,
        isError
    }] = useDoCurrencyExchangeMutation();

    useEffect(() => {
        if (countryFetched && countryData?.data?.country) {
            setCountryOfDeposit(countryData?.data?.country)
        }
    }, [countryData, countryFetched, countryOfDeposit]);

    const refs = {
        topUpMethodRef: useRef(null),
        currencyIdRef: useRef(null),
        amountRef: useRef(null),
    }

    useEffect(() => {
        dispatch(setItem({key: "title", value: "Top Up"}));
    }, [dispatch]);

    useEffect(() => {
        const handleCurrencyExchange = async () => {
            if (isValidNumber(topUpInputs.amount) &&
                isValidNumber(countryOfDeposit?.countryId) &&
                isValidString(sourceCurrencyCode) &&
                isValidString(targetCurrencyCode)) {

                try {
                    // Trigger the mutation with the appropriate arguments
                    await doCurrencyExchange({
                        sourceCurrencyCode,
                        targetCurrencyCode,
                        sourceAmount: topUpInputs.amount,
                        countryId: countryOfDeposit?.countryId || 1,  // Fallback for testing
                    }).unwrap();
                    console.log("Currency exchange successful");
                } catch (exception) {
                    console.log("Error is: ", exception);
                }

            } else {
                console.log("One of the inputs is still invalid");
                console.log("Amount: ", topUpInputs.amount);
                console.log("countryId: ", countryOfDeposit?.countryId);
                console.log("sourceCurrencyCode: ", sourceCurrencyCode);
                console.log("targetCurrencyCode: ", targetCurrencyCode);
            }
        };

        handleCurrencyExchange();
    }, [topUpInputs.amount, countryOfDeposit?.countryId, sourceCurrencyCode, targetCurrencyCode, dispatch, doCurrencyExchange]);


    const handleConfirmTopUp = () => {
        console.log(`Top-up method selected: ${selectedMethod}`);
    };

    const isValidNumber = (number) => Number(number) && number >= 1
    const isValidString = (str) => (str && typeof str === 'string' && str.trim().length >= 0)

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
                                        <Divider sx={{mb: 2}}/>
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
                                        <Grid container sx={{mb: 2}}>
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Method :</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography variant="h6"
                                                            sx={{fontWeight: 'normal'}}>{selectedMethod.label}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container sx={{mb: 2}}>
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>To :</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography variant="h6"
                                                            sx={{fontWeight: 'normal'}}>{currencyExchangeData?.currencyCode}</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    <CurrencySelector
                                        ref={refs.currencyIdRef}
                                        changeHandler={(currencyId, currencyCode) => {
                                            console.log("Currency code : ", currencyCode)
                                            setSourceCurrencyCode(currencyCode)
                                            return dispatch(handleValidation({
                                                objectName: "topUp",
                                                eventValue: currencyId,
                                                inputName: "currencyId",
                                                regexPattern: "CURRENCY_ID_REGEX"
                                            }))
                                        }}
                                        validCurrency={validTopUp.validCurrencyId}
                                        value={topUpInputs.currencyId}
                                        countryOfDepositId={topUpInputs.countryOfTopUpId}
                                        isFocused={topUpFocus.currencyIdFocus}
                                        handleFocus={() => dispatch(handleFocus({
                                            objectName: 'topUp',
                                            inputName: "currencyId"
                                        }))}
                                        handleBlur={() => dispatch(handleBlur({
                                            objectName: 'topUp',
                                            inputName: "currencyId",
                                            regexPattern: "CURRENCY_ID_REGEX"
                                        }))}/>
                                    {validTopUp.validCountryOfTopUpId && validTopUp.validTopUpMethod &&
                                        <AmountInput
                                            ref={refs.amountRef}
                                            changeHandler={(e) => dispatch(handleValidation({
                                                objectName: "topUp",
                                                eventValue: e.target.value,
                                                inputName: "amount",
                                                regexPattern: "AMOUNT_REGEX"
                                            }))}
                                            validAmount={validTopUp.validAmount}
                                            value={topUpInputs.amount}
                                            isFocused={topUpFocus.amountFocus}
                                            handleFocus={() => dispatch(handleFocus({
                                                objectName: 'topUp',
                                                inputName: "amount"
                                            }))}
                                            handleBlur={() => dispatch(handleBlur({
                                                objectName: 'topUp',
                                                inputName: "amount",
                                                regexPattern: "AMOUNT_REGEX"
                                            }))}/>
                                    }
                                    {validTopUp.validAmount && validTopUp.validTopUpMethod && validTopUp.validCountryOfTopUpId &&
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleConfirmTopUp}
                                            disabled={!selectedMethod}
                                            style={{marginTop: '20px'}}
                                        >
                                            Confirm Top-Up
                                        </Button>}
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