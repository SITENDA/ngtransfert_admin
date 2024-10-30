import React, {useEffect, useRef, useState} from 'react';
import { Button, Grid, List, ListItem, ListItemText } from '@mui/material';
import TopUpMethodSelector from "../../components/form-controls/TopUpMethodSelector";
import {darkColor, lightColor} from "../../util/initials";
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
import CountrySelector from "../../components/form-controls/CountrySelector";
import {adminPaths} from "../../util/frontend";

import {
    selectCashDepositAddressesByCountryName,
    useGetCashDepositAddressesByCountryNameQuery
} from "../cashDepositAddresses/cashDepositAddressesSlice";
import {
    selectBankDepositAddressesByCountryName,
    useGetBankDepositAddressesByCountryNameQuery
} from "../bankDepositAddresses/bankDepositAddressesSlice";
import TopUpMethod from "../../util/TopUpMethod";

const TopUpInstructions = () => {
    const [selectedMethod, setSelectedMethod] = useState('');
    const [selectedCountryName, setSelectedCountryName] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const topUpInputs = useSelector(selectTopUpInputs);
    const validTopUp = useSelector(selectValidTopUp);
    const topUpFocus = useSelector(selectTopUpFocus);

    const receiverAccount = location?.state?.receiverAccount;

    const refs = {
        topUpMethodRef: useRef(null),
    }

    useEffect(() => {
        if (!location?.state?.receiverAccount) {
            navigate(adminPaths.receiverAccountsPath, {replace: true})
        }
        dispatch(setItem({key: "title", value: "Top Up Instructions"}));
    }, [dispatch]);


    const handleGoToTopUp = () => {
        navigate(adminPaths.topUpPath, {
            state: {
                prevPath: window.location.pathname,
                selectedMethod: selectedMethod.value,
                selectedCountryName,
                receiverAccount,
            }
        });
    };

    useGetCashDepositAddressesByCountryNameQuery(selectedCountryName);
    useGetBankDepositAddressesByCountryNameQuery(selectedCountryName);
    const fetchedCashDepositAddresses = useSelector((state) => selectCashDepositAddressesByCountryName(state, selectedCountryName));
    const fetchedBankDepositAddresses = useSelector((state) => selectBankDepositAddressesByCountryName(state, selectedCountryName));

    // Top-up instructions for each method //beneficiary name and the company account. Kindly your bank branch
    const topUpInstructions = {
        BANK: (
            <List dense>
                <ListItem>
                    <ListItemText primary="Deposit to Any of the Branches Below:"
                                  secondary={`The list below shows the banks in ${selectedCountryName ? selectedCountryName : ''} in which NGTransfert has accounts, 
                                  and the account information. Please feel free to visit the nearest to you of any of these banks to make your deposit.`}/>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Take a Picture of the Receipt:"
                                  secondary="After making the deposit, please take a clear picture the receipt issued to you by the bank, confirming the deposit."/>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Return Here to Continue:"
                                  secondary="After taking the picture, return to this page and click the “Continue to Top Up” button to enter the remaining details."/>
                </ListItem>
            </List>),
        MOBILE_MONEY: "Send the top-up amount via Mobile Money to the number 123456789 and provide the transaction ID.",
        WAVE:
            (<List dense>
                    <ListItem>
                        <ListItemText primary="Our Wave Details:"
                                      secondary={`Top up using Wave by sending to (#########).`}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Account Number:"
                                      secondary={9999999}/>
                    </ListItem>
                    <ListItem>
                    <ListItemText primary="Take a Picture (screenshot):"
                                  secondary="Please remember to take a screenshot (picture) as proof that your transaction has been successful on Wave."/>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Return Here to Continue:"
                                  secondary="After taking the screenshot, return to this page and click the “Continue to Top Up” button to enter the remaining details."/>
                </ListItem>
                </List>
            ),
        ORANGE_MONEY:
            (<List dense>
                    <ListItem>
                        <ListItemText primary="Our Orange Money Details:"
                                      secondary={`Top up using Orange Money by sending to (#144#8*376385*amount*secret#).`}/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Account Number:"
                                      secondary={376385}/>
                    </ListItem>
                    <ListItem>
                    <ListItemText primary="Take a Picture (screenshot):"
                                  secondary="Please remember to take a screenshot (picture) as proof that your transaction has been successful on Orange Money."/>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Return Here to Continue:"
                                  secondary="After taking the screenshot, return to this page and click the “Continue to Top Up” button to enter the remaining details."/>
                </ListItem>
                </List>
            ),
        CASH: (
            <List dense>
                <ListItem>
                    <ListItemText primary="Visit Our Office:"
                                  secondary={`Please visit our ${selectedCountryName ? selectedCountryName : ''} office at the address provided below these instructions.`}/>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Fill Out the Required Form:"
                                  secondary="Our agent will provide you with a form to fill out. Carefully complete all the required fields on the form."/>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Form Should be Stamped:"
                                  secondary="Once you have filled in the form, please present it to our agent to be stamped."/>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Take a Picture of the Completed Form:"
                                  secondary="Take a clear picture the stamped form with your phone."/>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Return Here to Continue:"
                                  secondary="After taking the picture, return to this page and click the “Continue to Top Up” button to enter the remaining details."/>
                </ListItem>
            </List>
        )
    };

    return (
        <MainPageWrapper>
            <section className="container py-5" style={{
                background: isDarkTheme ? darkColor : lightColor,
                color: isDarkTheme ? lightColor : darkColor
            }}>
                <Grid container justifyContent="center">
                    <Grid item xs={12} md={8}>
                        <CountrySelector
                            ref={refs.countryOfDepositIdRef}
                            changeHandler={(countryOfDepositId) => dispatch(handleValidation({
                                objectName: "topUp",
                                eventValue: countryOfDepositId,
                                inputName: "countryOfTopUpId",
                                regexPattern: "COUNTRY_ID_REGEX"
                            }))}
                            label="Please select your country"
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
                            setSelectedCountryName={(countryName) => setSelectedCountryName(countryName)}
                        />

                        {validTopUp.validCountryOfTopUpId && (
                            <TopUpMethodSelector
                                ref={refs.topUpMethodRef}
                                changeHandler={(selectedOption) => {
                                    setSelectedMethod(selectedOption);
                                    return dispatch(handleValidation({
                                        objectName: "topUp",
                                        eventValue: selectedOption.value,
                                        inputName: "topUpMethod",
                                        regexPattern: "TOP_UP_METHOD_REGEX"
                                    }));
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
                            />
                        )}

                        {selectedMethod && (
                            <>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleGoToTopUp}
                                    style={{marginTop: '20px'}}
                                >
                                    Continue to top up
                                </Button>
                            </>
                        )}
                    </Grid>
                </Grid>
            </section>
        </MainPageWrapper>
    );
};

export default TopUpInstructions;