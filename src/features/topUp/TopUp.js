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
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleConfirmTopUp}
                                            disabled={!selectedMethod}
                                            style={{marginTop: '20px'}}
                                        >
                                            Confirm Top-Up
                                        </Button>
                                        <Divider sx={{my: 3}}/>
                                        {selectedMethod && (
                                            <>
                                                <Typography variant="h6" gutterBottom>
                                                    {selectedMethod.label} Instructions
                                                </Typography>
                                                <Divider sx={{mb: 2}}/>
                                                <Typography variant="body1">
                                                    {topUpInstructions[selectedMethod.value] || "Please select a method to see the instructions."}
                                                </Typography>
                                            </>
                                        )}
                                    </CardContent>

                                    {/*<CardActions>*/}
                                    {/*    <Button*/}
                                    {/*        variant="contained"*/}
                                    {/*        sx={{backgroundColor: '#4CAF50', color: '#fff'}} // Change to a green color*/}
                                    {/*        startIcon={<MonetizationOnIcon/>}*/}
                                    {/*        onClick={handleTopUpClick}*/}
                                    {/*        fullWidth*/}
                                    {/*    >*/}
                                    {/*        Top Up*/}
                                    {/*    </Button>*/}

                                    {/*</CardActions>*/}
                                    {/*<CardContent>*/}
                                    {/*    /!* Client Details Section *!/*/}
                                    {/*    <Typography variant="h5" gutterBottom>Client Details</Typography>*/}
                                    {/*    <Divider sx={{mb: 2}}/>*/}
                                    {/*    <Grid container sx={{mb: 2}} alignItems="center">*/}
                                    {/*        <Grid item xs={4}>*/}
                                    {/*            <Typography variant="h6" sx={{fontWeight: 'bold'}}>Name</Typography>*/}
                                    {/*        </Grid>*/}
                                    {/*        <Grid item xs={8} container alignItems="center">*/}
                                    {/*            /!*<Avatar src={alipayAccount.client.profileImageUrl}*!/*/}
                                    {/*            /!*        alt={alipayAccount.client.fullName} sx={{mr: 2}}/>*!/*/}
                                    {/*            <Typography variant="body1">{alipayAccount.client.fullName}</Typography>*/}
                                    {/*        </Grid>*/}
                                    {/*    </Grid>*/}
                                    {/*    <Grid container sx={{mb: 2}}>*/}
                                    {/*        <Grid item xs={4}>*/}
                                    {/*            <Typography variant="h6" sx={{fontWeight: 'bold'}}>Email</Typography>*/}
                                    {/*        </Grid>*/}
                                    {/*        <Grid item xs={8}>*/}
                                    {/*            <Typography variant="body1">{alipayAccount.client.email}</Typography>*/}
                                    {/*        </Grid>*/}
                                    {/*    </Grid>*/}
                                    {/*    <Grid container sx={{mb: 2}}>*/}
                                    {/*        <Grid item xs={4}>*/}
                                    {/*            <Typography variant="h6" sx={{fontWeight: 'bold'}}>Mobile</Typography>*/}
                                    {/*        </Grid>*/}
                                    {/*        <Grid item xs={8}>*/}
                                    {/*            <Typography*/}
                                    {/*                variant="body1">+{alipayAccount.client.phoneNumber}</Typography>*/}
                                    {/*        </Grid>*/}
                                    {/*    </Grid>*/}
                                    {/*</CardContent>*/}
                                    {/*<CardActions>*/}
                                    {/*    <Button*/}
                                    {/*        variant="contained"*/}
                                    {/*        color="error"*/}
                                    {/*        startIcon={<DeleteIcon/>}*/}
                                    {/*        onClick={handleDeleteAlipayAccountClick}*/}
                                    {/*        fullWidth*/}
                                    {/*    >*/}
                                    {/*        Delete Alipay Account*/}
                                    {/*    </Button>*/}
                                    {/*</CardActions>*/}
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
