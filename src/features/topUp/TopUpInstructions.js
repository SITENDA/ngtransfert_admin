import React, {useEffect, useRef, useState} from 'react';
import {Typography, Button, Grid, Divider, Box, List, ListItem, ListItemText, ListItemIcon} from '@mui/material';
import TopUpMethodSelector from "../../components/form-controls/TopUpMethodSelector";
import {darkColor, lightColor} from "../../util/initials";
import MainPageWrapper from "../../components/MainPageWrapper";
import {useNavigate} from "react-router-dom";
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
import InfoIcon from '@mui/icons-material/Info';
import PlaceIcon from '@mui/icons-material/Place';  // Import an icon for addresses
import {
    selectCashDepositAddressesByCountryName,
    useGetCashDepositAddressesByCountryNameQuery
} from "../cashDepositAddresses/cashDepositAddressesSlice";

const TopUpInstructions = () => {
    const [selectedMethod, setSelectedMethod] = useState('');
    const [selectedCountryName, setSelectedCountryName] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const topUpInputs = useSelector(selectTopUpInputs);
    const validTopUp = useSelector(selectValidTopUp);
    const topUpFocus = useSelector(selectTopUpFocus);

    const refs = {
        topUpMethodRef: useRef(null),
    }

    useEffect(() => {
        dispatch(setItem({key: "title", value: "Top Up Instructions"}));
    }, [dispatch]);

    const handleGoToTopUp = () => {
        navigate(adminPaths.topUpPath, {state: {prevPath: window.location.pathname, selectedMethod, selectedCountryName}});
    };

    useGetCashDepositAddressesByCountryNameQuery(selectedCountryName);
    const fetchedAddresses = useSelector((state) => selectCashDepositAddressesByCountryName(state, selectedCountryName));

    // Top-up instructions for each method
    const topUpInstructions = {
        BANK: "Visit your bank branch and deposit the funds to account number XXXX. Use your phone number as the reference.",
        MOBILE_MONEY: "Send the top-up amount via Mobile Money to the number 123456789 and provide the transaction ID.",
        ORANGE_MONEY: "Top up using Orange Money by transferring the funds to account ID ORANGE123.",
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
                    <ListItemText primary="Take a Picture of the Completed Form:"
                                  secondary="Once you have filled in the form, take a clear picture of it with your phone."/>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Return here to continue:"
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
                                <Divider sx={{my: 3}}/>
                                <Box
                                    sx={{
                                        padding: '20px',
                                        backgroundColor: 'rgba(249,249,163,0.3)',  // Soft yellow background
                                        border: '1px solid #ddd',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>
                                        <InfoIcon sx={{mr: 1, verticalAlign: 'middle'}}/>
                                        {selectedMethod.label} Instructions
                                    </Typography>
                                    <Divider sx={{mb: 2}}/>
                                    <Typography variant="body1">
                                        {topUpInstructions[selectedMethod.value] || "Please select a method to see the instructions."}
                                    </Typography>
                                </Box>

                                {/* Display the addresses fetched with styling */}
                                {fetchedAddresses.length > 0 && (
                                    <>
                                        <Divider sx={{my: 3}}/>
                                        <Typography variant="h6" gutterBottom>
                                            These are our addresses in {selectedCountryName}:
                                        </Typography>
                                        <List>
                                            {fetchedAddresses.map((address, index) => (
                                                <ListItem key={index} sx={{
                                                    backgroundColor: 'rgba(255, 192, 203, 0.5)',
                                                    borderRadius: '8px',
                                                    mb: 2
                                                }}>
                                                    <ListItemIcon>
                                                        <PlaceIcon color="primary"/>
                                                    </ListItemIcon>
                                                    <ListItemText primary={address.address}/>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </>
                                )}

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