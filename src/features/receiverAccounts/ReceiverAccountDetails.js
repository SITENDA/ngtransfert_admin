import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {setItem, selectIsDarkTheme} from '../auth/authSlice';
import {Modal, Box, Button, Card, CardContent, CardActions, Typography, Grid, Divider} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DeleteIcon from '@mui/icons-material/Delete';
import TickAnimation from '../../components/TickAnimation';
import {adminPaths} from '../../util/frontend';
import {darkColor, lightColor} from "../../util/initials";
import MainPageWrapper from "../../components/MainPageWrapper";
import ImageDisplay from "../../components/form-controls/ImageDisplay";
import EmailDisplay from "../../components/form-controls/EmailDisplay";
import PhoneNumberDisplay from "../../components/form-controls/PhoneNumberDisplay";
import ReceiverAccountIdentifier from "../../util/ReceiverAccountIdentifier";
import {useDeleteReceiverAccountMutation} from "./receiverAccountsSlice";
import ReceiverAccountType, {orderedReceiverAccountTypes} from "../../util/ReceiverAccountType";
import SelectedMethodDisplay from "../../components/form-controls/SelectedMethodDisplay";

const ReceiverAccountDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const [isDeleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
    const [deleteReceiverAccount] = useDeleteReceiverAccountMutation();
    const [tickAnimationVisible, setTickAnimationVisible] = useState(false);

    useEffect(() => {
        dispatch(setItem({key: "title", value: "Receiver Account Details"}));
    }, [dispatch]);

    const receiverAccount = location?.state?.receiverAccount;
    const displayedReceiverAccount = orderedReceiverAccountTypes.find(orderedReceiverAccountType => orderedReceiverAccountType.value === receiverAccount.receiverAccountType);

    const handleDeleteOk = async () => {
        const response = await deleteReceiverAccount(receiverAccount).unwrap();
        if (response?.statusCode === 200 && response?.message === "Receiver account deleted successfully") {
            setTickAnimationVisible(true);
            setTimeout(() => {
                navigate(adminPaths.receiverAccountsPath);
            }, 2000);
        }
        setDeleteAccountModalVisible(false);
    };

    const handleDeleteCancel = async () => {
        setDeleteAccountModalVisible(false);
    };

    const handleDeleteAlipayAccountClick = () => {
        setDeleteAccountModalVisible(true);
    };

    const handleApplyClick = () => {
        navigate(adminPaths.applyForTransferPath, {
            state: {
                prevPath: window.location.pathname,
                receiverAccount
            }
        });
    }

    const handleTopUpClick = () => {
        navigate(adminPaths.topUpInstructionsPath, {
            state: {
                prevPath: window.location.pathname,
                receiverAccount,
            }
        });
    }

    if (!receiverAccount) {
        navigate(adminPaths.receiverAccountsPath, {replace: true});
    }

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
                                    <CardActions>
                                        <Button
                                            variant="contained"
                                            color="primary" // Change to primary color for a positive action
                                            startIcon={<SendIcon/>} // Use SendIcon for transfer action
                                            onClick={handleApplyClick}
                                            fullWidth
                                        >
                                            Apply for a transfer
                                        </Button>
                                    </CardActions>

                                    <CardContent>
                                        {/* Account Details Section */}
                                        <Typography variant="h5" gutterBottom>Account Details</Typography>
                                        <Divider sx={{mb: 2}}/>
                                        <Grid container sx={{mb: 2}}>
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Type</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography
                                                    variant="body1"> <SelectedMethodDisplay
                                                    orderedReceiverAccountType={displayedReceiverAccount}/></Typography>
                                            </Grid>
                                        </Grid>
                                        <Divider sx={{mb: 2}}/>
                                        <Grid container sx={{mb: 2}}>
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Name</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography
                                                    variant="body1">{receiverAccount.receiverAccountName}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container sx={{mb: 2}}>

                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Balance</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography
                                                    variant="body1">{`${receiverAccount.currency.currencySymbol} ${receiverAccount.balance}`}</Typography>
                                            </Grid>
                                        </Grid>
                                        {receiverAccount.receiverAccountType === ReceiverAccountType.BANK_ACCOUNT &&
                                            <>
                                                <Divider sx={{mb: 2}}/>
                                                <Grid container sx={{mb: 2}}>
                                                    <Grid item xs={4}>
                                                        <Typography variant="h6"
                                                                    sx={{fontWeight: 'bold'}}>Number</Typography>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <Typography
                                                            variant="body1">{receiverAccount.bankAccountNumber}</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Divider sx={{my: 3}}/>
                                                {/* Bank Details Section */}
                                                <Typography variant="h5" gutterBottom>Bank Details</Typography>
                                                <Divider sx={{mb: 2}}/>
                                                <Grid container sx={{mb: 2}} alignItems="center">
                                                    <Grid item xs={4}>
                                                        <Typography variant="h6"
                                                                    sx={{fontWeight: 'bold'}}>Name</Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="body1">
                                                            {receiverAccount.bank.bankNameEng} ({receiverAccount.bank.bankShortName})
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <ImageDisplay imageUrl={receiverAccount.bank.bankLogoUrl}
                                                                      title={receiverAccount.bank.bankNameEng}/>
                                                    </Grid>
                                                </Grid>
                                                <Grid container sx={{mb: 2}} alignItems="center">
                                                    <Grid item xs={4}>
                                                        <Typography variant="h6"
                                                                    sx={{fontWeight: 'bold'}}>Country</Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="body1">
                                                            {receiverAccount.bank.country.countryName}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        <ImageDisplay
                                                            imageUrl={receiverAccount.bank.country.countryFlagUrl}
                                                            title={receiverAccount.bank.country.countryName}/>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        }
                                        {receiverAccount.receiverAccountIdentifier === "email" && (
                                            <Grid container sx={{mb: 2}}>
                                                <Grid item xs={4}>
                                                    <Typography variant="h6"
                                                                sx={{fontWeight: 'bold'}}>Email</Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <EmailDisplay
                                                        email={<EmailDisplay email={receiverAccount.email}/>}/>
                                                </Grid>
                                            </Grid>
                                        )}
                                        {receiverAccount.receiverAccountIdentifier === ReceiverAccountIdentifier.PHONE_NUMBER && (
                                            <Grid container sx={{mb: 2}}>
                                                <Grid item xs={4}>
                                                    <Typography variant="h6"
                                                                sx={{fontWeight: 'bold'}}>Mobile</Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <PhoneNumberDisplay phoneNumber={receiverAccount.phoneNumber}/>
                                                </Grid>
                                            </Grid>
                                        )}
                                        {receiverAccount.receiverAccountIdentifier === ReceiverAccountIdentifier.QR_CODE_IMAGE && (
                                            <Grid container sx={{mb: 2}}>
                                                <Grid item xs={4}>
                                                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>QR
                                                        Code</Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <ImageDisplay imageUrl={receiverAccount.qrCodeUrl}
                                                                  title="QR Code"/>
                                                </Grid>
                                            </Grid>
                                        )}
                                        <Divider sx={{my: 3}}/>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            variant="contained"
                                            sx={{backgroundColor: '#4CAF50', color: '#fff'}} // Change to a green color
                                            startIcon={<MonetizationOnIcon/>}
                                            onClick={handleTopUpClick}
                                            fullWidth
                                        >
                                            Top Up
                                        </Button>

                                    </CardActions>
                                    <CardContent>
                                        {/* Client Details Section */}
                                        <Typography variant="h5" gutterBottom>Client Details</Typography>
                                        <Divider sx={{mb: 2}}/>
                                        <Grid container sx={{mb: 2}} alignItems="center">
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Name</Typography>
                                            </Grid>
                                            <Grid item xs={8} container alignItems="center">
                                                {/*<Avatar src={alipayAccount.client.profileImageUrl}*/}
                                                {/*        alt={alipayAccount.client.fullName} sx={{mr: 2}}/>*/}
                                                <Typography
                                                    variant="body1">{receiverAccount.client.fullName}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container sx={{mb: 2}}>
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Email</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography variant="body1">{receiverAccount.client.email}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container sx={{mb: 2}}>
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Mobile</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography
                                                    variant="body1">{receiverAccount.client.phoneNumber}</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            startIcon={<DeleteIcon/>}
                                            onClick={handleDeleteAlipayAccountClick}
                                            fullWidth
                                        >
                                            Delete Receiver Account
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>

                            <Modal
                                open={isDeleteAccountModalVisible}
                                onClose={handleDeleteCancel}
                            >
                                <Box sx={{
                                    ...modalStyle,
                                    background: isDarkTheme ? darkColor : lightColor,
                                    color: isDarkTheme ? lightColor : darkColor
                                }}>
                                    <Typography variant="h6" component="h2">
                                        Confirm Delete Receiver Account
                                    </Typography>
                                    <Typography sx={{mt: 2}}>
                                        Are you sure you want to delete this Receiver account? All information about
                                        this
                                        account will be lost.
                                    </Typography>
                                    <Box sx={{mt: 2, display: 'flex', justifyContent: 'flex-end'}}>
                                        <Button onClick={handleDeleteOk} color="primary">
                                            Ok
                                        </Button>
                                        <Button onClick={handleDeleteCancel} color="secondary" sx={{ml: 2}}>
                                            Cancel
                                        </Button>
                                    </Box>
                                </Box>
                            </Modal>
                        </>
                    )}
                </Grid>
                {tickAnimationVisible && <TickAnimation successMessage="Receiver Account deleted successfully!"/>}
            </section>
        </MainPageWrapper>
    );
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default ReceiverAccountDetails;
