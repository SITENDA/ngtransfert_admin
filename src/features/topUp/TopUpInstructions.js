import React, {useEffect, useRef, useState} from 'react';
import { Button, Grid } from '@mui/material';
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