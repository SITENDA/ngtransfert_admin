import React, {useEffect, useRef, useState} from 'react';
import {Typography, Button, Grid, Card, CardActions, CardContent, Divider, Modal, Box} from '@mui/material';
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
import CountrySelector from "../../components/form-controls/CountrySelector";

const TopUp = () => {
    const [selectedMethod, setSelectedMethod] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const [isDeleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
    const [deleteAlipayAccount] = useDeleteAlipayAccountMutation();
    const [tickAnimationVisible, setTickAnimationVisible] = useState(false);
    const topUpInputs = useSelector(selectTopUpInputs)
    const validTopUp = useSelector(selectValidTopUp)
    const topUpFocus = useSelector(selectTopUpFocus)

    const handleMethodChange = (event) => {
        setSelectedMethod(event.target.value);
    };

    const refs = {
        topUpMethodRef: useRef(null),
        amountRef: useRef(null),
    }

    useEffect(() => {
        dispatch(setItem({key: "title", value: "Top Up"}));
    }, [dispatch]);

    const handleConfirmTopUp = () => {
        // Logic to handle the top-up action
        console.log(`Top-up method selected: ${selectedMethod}`);
    };

    // Top-up instructions for each method
    const topUpInstructions = {
        BANK: "Visit your bank branch and deposit the funds to account number XXXX. Use your phone number as the reference.",
        MOBILE_MONEY: "Send the top-up amount via Mobile Money to the number 123456789 and provide the transaction ID.",
        ORANGE_MONEY: "Top up using Orange Money by transferring the funds to account ID ORANGE123.",
        CASH: "Visit our office to deposit cash directly. Please bring a valid ID for verification."
    };

    // TODO - To turn this into a TopUp Instructions page having only the country of top up and method,
    //  and add a continue to top up button that takes the user to
    //  the actual inputs for top up
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
                                <CountrySelector
                                    ref={refs.countryOfDepositIdRef}
                                    changeHandler={(countryOfDepositId) => dispatch(handleValidation({
                                        objectName: "topUp",
                                        eventValue: countryOfDepositId,
                                        inputName: "countryOfTopUpId",
                                        regexPattern: "COUNTRY_ID_REGEX"
                                    }))}
                                    label="Country of top up"
                                    validCountry={validTopUp.validCountryOfTopUpId}
                                    value={topUpInputs.countryOfTopUpId}
                                    isFocused={topUpFocus.countryOfTopUpIdFocus}
                                    handleFocus={() => dispatch(handleFocus({
                                        objectName: 'topUp',
                                        inputName: "countryOfTopUpId"
                                    }))}
                                    handleBlur={() => dispatch(handleBlur({
                                        objectName: 'topUp',
                                        inputName: "countryOfTopUpId",
                                        regexPattern: "COUNTRY_ID_REGEX"
                                    }))}
                                />

                                {validTopUp.validCountryOfTopUpId &&
                                    <TopUpMethodSelector
                                        ref={refs.topUpMethodRef}
                                        changeHandler={(selectedOption) => {
                                            console.log("Selected option : ", selectedOption);
                                            setSelectedMethod(selectedOption)
                                            return dispatch(handleValidation({
                                                objectName: "topUp",
                                                eventValue: selectedOption.value,
                                                inputName: "topUpMethod",
                                                regexPattern: "TOP_UP_METHOD_REGEX"
                                            }))
                                        }}
                                        validTopUpMethod={validTopUp.validTopUpMethod}
                                        value={topUpInputs.topUpMethod}
                                        isFocused={topUpFocus.topUpMethodFocus}
                                        handleFocus={() => dispatch(handleFocus({
                                            objectName: 'topUp',
                                            inputName: "topUpMethod"
                                        }))}
                                        handleBlur={() => dispatch(handleBlur({
                                            objectName: 'topUp',
                                            inputName: "topUpMethod",
                                            regexPattern: "TOP_UP_METHOD_REGEX"
                                        }))}
                                    />}

                                {selectedMethod && (
                                    <>
                                        <Divider sx={{my: 3}}/>
                                        <Typography variant="h6" gutterBottom>
                                            {selectedMethod.label} Instructions
                                        </Typography>
                                        <Divider sx={{mb: 2}}/>
                                        <Typography variant="body1">
                                            {topUpInstructions[selectedMethod.value] || "Please select a method to see the instructions."}
                                        </Typography>
                                    </>
                                )}
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
                                        }))}
                                    />
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
