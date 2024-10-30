import React, {useEffect, useRef, useState} from 'react';
import {Typography, Button, Grid, Card, CardContent, Divider, CircularProgress} from '@mui/material';
import {darkColor, initialTopUpInputs, lightColor} from "../../util/initials";
import ImageDisplay from "../../components/form-controls/ImageDisplay";
import TickAnimation from "../../components/TickAnimation";
import MainPageWrapper from "../../components/MainPageWrapper";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { handleBlur, handleFocus, handleImageChange, handleValidation, isValidNumber, selectIsDarkTheme, selectTopUpFocus, selectTopUpInputs, selectValidTopUp, setItem, setObjectItem } from "../auth/authSlice";
import AmountInput from "../../components/form-controls/AmountInput";
import {useGetCountryByCountryNameQuery} from "../countries/countriesSlice";
import {orderedTopUpMethods} from "../../util/TopUpMethod";
import SelectedMethodDisplay from "../../components/form-controls/SelectedMethodDisplay";
import {
    useTopUpAccountBalanceMutation,
    useGetRateForCurrencyAndCountryQuery,
    useGetAmountInCNYMutation,
    useGetAmountInOtherCurrencyMutation
} from "./topUpSlice";
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

    const refs = {
        topUpMethodRef              : useRef(null),
        currencyIdRef               : useRef(null),
        amountInOtherCurrencyRef    : useRef(null),
        amountInCNYRef              : useRef(null),
        proofPictureRef             : useRef(null),
    }

    const [tickAnimationVisible, setTickAnimationVisible] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);
    const [countryOfDeposit, setCountryOfDeposit] = useState(null);
    const [rateForCurrencyAndCountry, setRateForCurrencyAndCountry] = useState(null);

    const stateSelectedMethod = location.state.selectedMethod;
    const foundMethod = orderedTopUpMethods.find(method => method.value === stateSelectedMethod);
    const selectedMethod = {...foundMethod, label: <SelectedMethodDisplay orderedReceiverAccountType={foundMethod}/>};
    const selectedCountryName = location.state.selectedCountryName;
    const [topUpAccountBalance, {
        isLoading: topUpLoading,
        isSuccess: topUpIsSuccessful,
        isError: topUpHasError,
        error
    }] = useTopUpAccountBalanceMutation();

    const {data: countryData, isSuccess: countryFetched} = useGetCountryByCountryNameQuery(selectedCountryName);

    const [getAmountInCNY, {
        data: amountInCNYData,
        isLoading: loadingAmountInCNY,
        isSuccess: gotAmountInCNY,
        isError: errorGettingAmountInCNY
    }] = useGetAmountInCNYMutation();

    const [getAmountInOtherCurrency, {
        data: amountInOtherCurrencyData,
        isLoading: loadingAmountInOtherCurrency,
        isSuccess: gotAmountInOtherCurrency,
        isError: errorGettingAmountInOtherCurrency
    }] = useGetAmountInOtherCurrencyMutation();

    const {
        data: rateForCurrencyAndCountryData,
        isLoading: loadingRateForCurrencyAndCountry,
        isSuccess: successfullyLoadedRateForCurrencyAndCountry,
        isError: errorGettingRateForCurrencyAndCountry
    } = useGetRateForCurrencyAndCountryQuery(selectedCountryName);

    useEffect(() => {
        if (gotAmountInCNY && amountInCNYData?.amountInCNY) {
            dispatch(setObjectItem({
                key: "topUpInputs",
                innerKey: "amountInCNY",
                value: amountInCNYData?.amountInCNY
            }));
        }
    }, [amountInCNYData?.amountInCNY, dispatch, gotAmountInCNY]);

    useEffect(() => {
        if (gotAmountInOtherCurrency && amountInOtherCurrencyData?.amountInOtherCurrency) {
            dispatch(setObjectItem({
                key: "topUpInputs",
                innerKey: "amountInOtherCurrency",
                value: amountInOtherCurrencyData?.amountInOtherCurrency
            }));
        }
    }, [amountInOtherCurrencyData?.amountInOtherCurrency, dispatch, gotAmountInOtherCurrency]);


    useEffect(() => {
        if (successfullyLoadedRateForCurrencyAndCountry && rateForCurrencyAndCountryData) {
            setRateForCurrencyAndCountry(rateForCurrencyAndCountryData)
        }
    }, [rateForCurrencyAndCountryData, successfullyLoadedRateForCurrencyAndCountry]);

    useEffect(() => {
        if (countryFetched && countryData?.data?.country) {
            setCountryOfDeposit(countryData?.data?.country)
            dispatch(setObjectItem({
                key: "topUpInputs",
                innerKey: "otherCurrencyCode",
                value: countryData?.data?.country?.currency?.currencyCode
            }))
        }
    }, [countryData, countryFetched, countryOfDeposit, dispatch]);

    const handleGetAmountInCNY = async () => {
        if ((isValidNumber(topUpInputs.amountInOtherCurrency))) {
            await getAmountInCNY({
                countryName: selectedCountryName,
                amountInOtherCurrency: topUpInputs.amountInOtherCurrency,
            }).unwrap();
            setCanSubmit(false);
        } else {
            console.error("handleGetAmountInCNY : Amount in other currency is invalid");
        }
    }

    const handleGetAmountInOtherCurrency = async () => {
        if ((isValidNumber(topUpInputs.amountInCNY))) {
            await getAmountInOtherCurrency({
                countryName: selectedCountryName,
                amountInCNY: topUpInputs.amountInCNY,
            }).unwrap();
            setCanSubmit(false);
        } else {
            console.error("handleGetAmountInOtherCurrency : Amount in CNY is invalid");
        }
    }


    useEffect(() => {
        dispatch(setItem({key: "title", value: "Top Up"}));
    }, [dispatch]);

    const handleConfirmTopUp = async () => {
        try {
            const topUpData = new FormData();
            topUpData.append("receiverAccountType", receiverAccount?.receiverAccountType);
            topUpData.append("receiverAccountIdentifier", receiverAccount?.receiverAccountIdentifier);
            topUpData.append("receiverAccountId", receiverAccount?.receiverAccountId);
            topUpData.append("currency", topUpInputs?.cnyCurrencyCode);
            topUpData.append("amountInCNY", topUpInputs?.amountInCNY);
            topUpData.append("proofPicture", topUpInputs.proofPicture?.file || new Blob());

            // Set loading to true when the request starts
            const response = await topUpAccountBalance(topUpData).unwrap();
            if (response?.statusCode === 200 && response?.message === "Top Up Requested successfully") {
                setTickAnimationVisible(true);
                setTimeout(() => {
                    navigate(adminPaths.receiverAccountsPath);
                }, 2000);
            }
        } catch (error) {
            console.error('Error topping up:', error);
        } finally {
            // setLoading(false);  // Set loading to false when the request completes
            dispatch(setItem({
                key: "topUpInputs",
                value: initialTopUpInputs
            }));
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
                                                <Typography variant="body1" sx={{fontWeight: 'bold'}}>Country
                                                    :</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <ImageDisplay
                                                    imageUrl={countryOfDeposit?.countryFlagUrl}
                                                    title={`${countryOfDeposit?.countryName} Flag`}/>
                                                <Typography variant="body1"
                                                            sx={{fontWeight: 'normal'}}>{countryOfDeposit?.countryName}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Divider sx={{mb: 2}}/>
                                        <Grid container>
                                            <Grid item xs={4}>
                                                <Typography variant="body1" sx={{fontWeight: 'bold'}}>Method
                                                    :</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography variant="body1"
                                                            sx={{fontWeight: 'normal'}}>{selectedMethod.label}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Divider sx={{mb: 2}}/>

                                        {rateForCurrencyAndCountry?.adminRate && <Grid container>
                                            <Grid item xs={4}>
                                                <Typography variant="body1" sx={{fontWeight: 'bold'}}>Rate
                                                    :</Typography>
                                            </Grid>
                                            {loadingRateForCurrencyAndCountry ? <CircularProgress size={15}/> :
                                                <Grid item xs={8}>
                                                    <Typography variant="body1"
                                                                sx={{fontWeight: 'normal'}}>{rateForCurrencyAndCountry?.adminRate}</Typography>
                                                </Grid>}


                                        </Grid>}
                                        <Divider sx={{mb: 2}}/>
                                        <Grid container>
                                            <Grid item xs={4}>
                                                <Typography variant="body1" sx={{fontWeight: 'bold'}}>Limit
                                                    :</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography
                                                    variant="body1">{`${receiverAccount.currency.currencySymbol} ${receiverAccount.limit}`}</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>

                                    {validTopUp.validCountryOfTopUpId && validTopUp.validTopUpMethod &&
                                        <>
                                            <Divider sx={{mb: 2}}/>

                                            <Grid container spacing={2} alignItems="center">
                                                {/* AmountInput for amount in other currency */}
                                                <Grid item xs={12} sm={8}>
                                                    {loadingAmountInOtherCurrency ? (
                                                        <CircularProgress size={15}/>
                                                    ) : (
                                                        <AmountInput
                                                            ref={refs.amountInOtherCurrencyRef}
                                                            changeHandler={(e) => {
                                                                setCanSubmit(true);
                                                                if (e.target.value === 0) {
                                                                    dispatch(setObjectItem({
                                                                        key: "topUpInputs",
                                                                        innerKey: "amountInCNY",
                                                                        value: 0
                                                                    }));
                                                                }
                                                                return dispatch(handleValidation({
                                                                    objectName: "topUp",
                                                                    eventValue: e.target.value,
                                                                    inputName: "amountInOtherCurrency",
                                                                    regexPattern: "AMOUNT_REGEX"
                                                                }));
                                                            }}
                                                            validAmount={validTopUp.validAmountInOtherCurrency}
                                                            value={topUpInputs.amountInOtherCurrency}
                                                            label={countryOfDeposit?.currency?.currencyCode
                                                                ? `Amount in ${countryOfDeposit?.currency?.currencyCode}`
                                                                : "Amount"}
                                                            isFocused={topUpFocus.amountInOtherCurrencyFocus}
                                                            handleFocus={() =>
                                                                dispatch(handleFocus({
                                                                    objectName: "topUp",
                                                                    inputName: "amountInOtherCurrency"
                                                                }))
                                                            }
                                                            handleGetAmountInCNY={handleGetAmountInCNY}
                                                            handleBlur={() =>
                                                                dispatch(handleBlur({
                                                                    objectName: "topUp",
                                                                    inputName: "amountInOtherCurrency",
                                                                    regexPattern: "AMOUNT_REGEX"
                                                                }))
                                                            }
                                                        />
                                                    )}
                                                </Grid>
                                            </Grid>

                                            <Divider sx={{mb: 2}}/>

                                            <Grid container spacing={2} alignItems="center">
                                                {/* AmountInput for amount in other currency */}
                                                <Grid item xs={12} sm={8}>
                                                    {loadingAmountInCNY ? (
                                                        <CircularProgress size={15}/>
                                                    ) : (
                                                        <AmountInput
                                                            ref={refs.amountInCNYRef}
                                                            changeHandler={(e) => {
                                                                setCanSubmit(true);
                                                                if (e.target.value === 0) {
                                                                    dispatch(setObjectItem({
                                                                        key: "topUpInputs",
                                                                        innerKey: "amountInOtherCurrency",
                                                                        value: 0
                                                                    }));
                                                                }
                                                                return dispatch(handleValidation({
                                                                    objectName: "topUp",
                                                                    eventValue: e.target.value,
                                                                    inputName: "amountInCNY",
                                                                    regexPattern: "AMOUNT_REGEX"
                                                                }));
                                                            }}
                                                            validAmount={validTopUp.validAmountInCNY}
                                                            value={topUpInputs.amountInCNY}
                                                            label="Amount in CNY"
                                                            isFocused={topUpFocus.amountInCNYFocus}
                                                            handleGetAmountInOtherCurrency={handleGetAmountInOtherCurrency}
                                                            handleFocus={() =>
                                                                dispatch(handleFocus({
                                                                    objectName: "topUp",
                                                                    inputName: "amountInCNY"
                                                                }))
                                                            }
                                                            handleBlur={() =>
                                                                dispatch(handleBlur({
                                                                    objectName: "topUp",
                                                                    inputName: "amountInCNY",
                                                                    regexPattern: "AMOUNT_REGEX"
                                                                }))
                                                            }
                                                        />
                                                    )}
                                                </Grid>
                                            </Grid>

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
                                    {(validTopUp.validAmountInCNY || validTopUp.validAmountInOtherCurrency) &&
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