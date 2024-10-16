import React, {useEffect, useRef, useState} from 'react';
import {Typography, Button, Grid, Card, CardContent, Divider, CircularProgress} from '@mui/material';
import {darkColor, lightColor} from "../../util/initials";
import ImageDisplay from "../../components/form-controls/ImageDisplay";
import TickAnimation from "../../components/TickAnimation";
import MainPageWrapper from "../../components/MainPageWrapper";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    handleBlur,
    handleFocus,
    handleImageChange,
    handleValidation,
    isValidNumber,
    selectIsDarkTheme,
    selectTopUpFocus,
    selectTopUpInputs,
    selectValidTopUp,
    setItem,
    setObjectItem
} from "../auth/authSlice";
import AmountInput from "../../components/form-controls/AmountInput";
import {useGetCountryByCountryNameQuery} from "../countries/countriesSlice";
import {orderedTopUpMethods} from "../../util/TopUpMethod";
import SelectedMethodDisplay from "../../components/form-controls/SelectedMethodDisplay";
import {
    useTopUpAccountBalanceMutation,
    useGetRateForCurrencyAndCountryQuery,
    useGetAmountInCNYMutation,
    useGetAmountInTargetCurrencyMutation
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
        topUpMethodRef: useRef(null),
        currencyIdRef: useRef(null),
        sourceAmountRef: useRef(null),
        targetAmountRef: useRef(null),
        proofPictureRef: useRef(null),
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

    const [getAmountInTargetCurrency, {
        data: amountInTargetCurrencyData,
        isLoading: loadingAmountInTargetCurrency,
        isSuccess: gotAmountInTargetCurrency,
        isError: errorGettingAmountInTargetCurrency
    }] = useGetAmountInTargetCurrencyMutation();

    const {
        data: rateForCurrencyAndCountryData,
        isLoading: loadingRateForCurrencyAndCountry,
        isSuccess: successfullyLoadedRateForCurrencyAndCountry,
        isError: errorGettingRateForCurrencyAndCountry
    } = useGetRateForCurrencyAndCountryQuery(selectedCountryName);

    useEffect(() => {
        if (gotAmountInCNY && amountInCNYData?.targetAmount) {
            dispatch(setObjectItem({
                key: "topUpInputs",
                innerKey: "targetAmount",
                value: amountInCNYData?.targetAmount
            }));
        }
    }, [amountInCNYData?.targetAmount, dispatch, gotAmountInCNY]);

    useEffect(() => {
        if (gotAmountInTargetCurrency && amountInTargetCurrencyData?.sourceAmount) {
            dispatch(setObjectItem({
                key: "topUpInputs",
                innerKey: "sourceAmount",
                value: amountInTargetCurrencyData?.sourceAmount
            }));
        }
    }, [amountInTargetCurrencyData?.sourceAmount, dispatch, gotAmountInTargetCurrency]);


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
                innerKey: "sourceCurrencyCode",
                value: countryData?.data?.country?.currency?.currencyCode
            }))
        }
    }, [countryData, countryFetched, countryOfDeposit, dispatch]);

    const handleGetAmountInCNY = async () => {
        if ((isValidNumber(topUpInputs.sourceAmount)) && canSubmit) {
            await getAmountInCNY({
                countryName: selectedCountryName,
                sourceAmount: topUpInputs.sourceAmount,
            }).unwrap();
            setCanSubmit(false);
        } else {
            console.error("Source amount is invalid");
        }
    }

    const handleGetAmountInTargetCurrency = async () => {
        if ((isValidNumber(topUpInputs.targetAmount)) && canSubmit) {
            await getAmountInTargetCurrency({
                countryName: selectedCountryName,
                targetAmount: topUpInputs.targetAmount,
            }).unwrap();
            setCanSubmit(false);
            console.log('Data returned is : ', amountInCNYData)
        } else {
            console.error("Target amount is invalid");
        }
    }


    useEffect(() => {
        dispatch(setItem({key: "title", value: "Top Up"}));
    }, [dispatch]);

    const handleConfirmTopUp = async (e) => {
        e.preventDefault();
        try {
            const topUpData = new FormData();
            topUpData.append("receiverAccountType", receiverAccount?.receiverAccountType);
            topUpData.append("accountIdentifier", receiverAccount?.receiverAccountIdentifier);
            topUpData.append("accountId", receiverAccount?.receiverAccountId);
            topUpData.append("currency", topUpInputs?.targetCurrencyCode);
            topUpData.append("amountInRMB", topUpInputs?.targetAmount);
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
                                                {/* AmountInput for source amount */}
                                                <Grid item xs={12} sm={8}>
                                                    {loadingAmountInTargetCurrency ? (
                                                        <CircularProgress size={15}/>
                                                    ) : (
                                                        <AmountInput
                                                            ref={refs.sourceAmountRef}
                                                            changeHandler={(e) => {
                                                                setCanSubmit(true);
                                                                if (e.target.value === 0) {
                                                                    dispatch(setObjectItem({
                                                                        key: "topUpInputs",
                                                                        innerKey: "targetAmount",
                                                                        value: 0
                                                                    }));
                                                                }
                                                                dispatch(handleValidation({
                                                                    objectName: "topUp",
                                                                    eventValue: e.target.value,
                                                                    inputName: "sourceAmount",
                                                                    regexPattern: "AMOUNT_REGEX"
                                                                }));
                                                                return dispatch(handleValidation({
                                                                    objectName: "topUp",
                                                                    eventValue: topUpInputs.targetAmount,
                                                                    inputName: "targetAmount",
                                                                    regexPattern: "AMOUNT_REGEX"
                                                                }));
                                                            }}
                                                            validAmount={validTopUp.validSourceAmount}
                                                            value={topUpInputs.sourceAmount}
                                                            label={countryOfDeposit?.currency?.currencyCode
                                                                ? `Amount in ${countryOfDeposit?.currency?.currencyCode}`
                                                                : "Amount"}
                                                            isFocused={topUpFocus.sourceAmountFocus}
                                                            handleFocus={() =>
                                                                dispatch(handleFocus({
                                                                    objectName: "topUp",
                                                                    inputName: "sourceAmount"
                                                                }))
                                                            }
                                                            handleBlur={() =>
                                                                dispatch(handleBlur({
                                                                    objectName: "topUp",
                                                                    inputName: "sourceAmount",
                                                                    regexPattern: "AMOUNT_REGEX"
                                                                }))
                                                            }
                                                        />
                                                    )}
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Button
                                                        variant="contained"
                                                        fullWidth
                                                        onClick={handleGetAmountInCNY}
                                                        sx={{
                                                            minWidth: 'fit-content',       // Make the button as narrow as possible
                                                            width: 'fit-content',
                                                            backgroundColor: 'rgba(160,160,7, 0.8)',    // Orange color for the button
                                                            textTransform: 'none',         // Prevent text from being capitalized
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(255,140,0,0.6)',  // Darker orange on hover
                                                            },
                                                        }}
                                                    >
                                                        Get amount in CNY
                                                    </Button>
                                                </Grid>
                                            </Grid>

                                            <Divider sx={{mb: 2}}/>

                                            <Grid container spacing={2} alignItems="center">
                                                {/* AmountInput for target amount */}
                                                <Grid item xs={12} sm={8}>
                                                    {loadingAmountInCNY ? (
                                                        <CircularProgress size={15}/>
                                                    ) : (
                                                        <AmountInput
                                                            ref={refs.targetAmountRef}
                                                            changeHandler={(e) => {
                                                                setCanSubmit(true);
                                                                if (e.target.value === 0) {
                                                                    dispatch(setObjectItem({
                                                                        key: "topUpInputs",
                                                                        innerKey: "sourceAmount",
                                                                        value: 0
                                                                    }));
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
                                                                }));
                                                            }}
                                                            validAmount={validTopUp.validTargetAmount}
                                                            value={topUpInputs.targetAmount}
                                                            label="Amount in CNY"
                                                            isFocused={topUpFocus.targetAmountFocus}
                                                            handleFocus={() =>
                                                                dispatch(handleFocus({
                                                                    objectName: "topUp",
                                                                    inputName: "targetAmount"
                                                                }))
                                                            }
                                                            handleBlur={() =>
                                                                dispatch(handleBlur({
                                                                    objectName: "topUp",
                                                                    inputName: "targetAmount",
                                                                    regexPattern: "AMOUNT_REGEX"
                                                                }))
                                                            }
                                                        />
                                                    )}
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Button
                                                        variant="contained"
                                                        fullWidth
                                                        onClick={handleGetAmountInTargetCurrency}
                                                        sx={{
                                                            minWidth: 'fit-content',       // Make the button as narrow as possible
                                                            width: 'fit-content',
                                                            backgroundColor: 'rgba(8,161,41,0.8)',    // Orange color for the button
                                                            textTransform: 'none',         // Prevent text from being capitalized
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(255,140,0,0.6)',  // Darker orange on hover
                                                            },
                                                        }}
                                                    >
                                                        Get amount
                                                        in {countryOfDeposit?.currency?.currencyCode || "source currency"}
                                                    </Button>
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