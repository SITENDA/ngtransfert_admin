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

const TopUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const [deleteAlipayAccount] = useDeleteAlipayAccountMutation();
    const [tickAnimationVisible, setTickAnimationVisible] = useState(false);
    const selectedMethod = location.state.selectedMethod;
    const selectedCountryName = location.state.selectedCountryName;

    const topUpInputs = useSelector(selectTopUpInputs)
    const validTopUp = useSelector(selectValidTopUp)
    const topUpFocus = useSelector(selectTopUpFocus)

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
