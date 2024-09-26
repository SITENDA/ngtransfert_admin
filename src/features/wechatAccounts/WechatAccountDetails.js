import React, {useEffect, useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {setItem, selectIsDarkTheme} from '../auth/authSlice';
import {
    Modal,
    Box,
    Button,
    Card,
    CardContent,
    CardActions,
    Typography,
    Grid,
    Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import {useDeleteWechatAccountMutation} from "./wechatAccountsSlice";
import TickAnimation from '../../components/TickAnimation';
import {adminPaths} from '../../util/frontend';
import {darkColor, lightColor} from "../../util/initials";
import MainPageWrapper from "../../components/MainPageWrapper";
import ImageDisplay from "../../components/form-controls/ImageDisplay";
import EmailDisplay from "../../components/form-controls/EmailDisplay";
import PhoneNumberDisplay from "../../components/form-controls/PhoneNumberDisplay";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";


const WechatAccountDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const [isDeleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
    const [deleteWechatAccount] = useDeleteWechatAccountMutation();
    const [tickAnimationVisible, setTickAnimationVisible] = useState(false);

    useEffect(() => {
        dispatch(setItem({key: "title", value: "Wechat Account Details"}));
    }, [dispatch]);

    let wechatAccount = location?.state?.wechatAccount;

    const handleDeleteOk = async () => {
        const response = await deleteWechatAccount(wechatAccount).unwrap();
        if (response?.statusCode === 200 && response?.message === "Wechat account deleted successfully") {
            setTickAnimationVisible(true);
            setTimeout(() => {
                navigate(adminPaths.wechatAccountsPath);
            }, 2000);
        }
        setDeleteAccountModalVisible(false);
    };

    const handleDeleteCancel = async () => {
        setDeleteAccountModalVisible(false);
    };

    const handleDeleteWechatAccountClick = () => {
        setDeleteAccountModalVisible(true);
    };

    const handleApplyClick = () => {
        navigate(adminPaths.applyForTransferPath, {
            state: {
                prevPath: window.location.pathname,
                wechatAccount
            }
        });
    }

    const handleTopUpClick = () => {
        navigate(adminPaths.topUpPath, {
            state: {
                prevPath: window.location.pathname,
                wechatAccount
            }
        });
    }

    if (!wechatAccount) {
        return <Typography align="center" color="error" variant="h5" sx={{mt: 5}}>Wechat Account not
            found!</Typography>;
    }

    return (
        <MainPageWrapper>
            <section className="container py-5" style={{
                background: isDarkTheme ? darkColor : lightColor,
                color: isDarkTheme ? lightColor : darkColor,
                scrollbarWidth: 'none'
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
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Name</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography
                                                    variant="body1">{wechatAccount.wechatAccountName}</Typography>
                                            </Grid>
                                        </Grid>
                                        {wechatAccount.email && !wechatAccount.email.startsWith("rand") && (
                                            <Grid container sx={{mb: 2}}>
                                                <Grid item xs={4}>
                                                    <Typography variant="h6"
                                                                sx={{fontWeight: 'bold'}}>Email</Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <EmailDisplay email={<EmailDisplay email={wechatAccount.email}/>}/>
                                                </Grid>
                                            </Grid>
                                        )}
                                        {wechatAccount?.phoneNumber && !wechatAccount.phoneNumber.startsWith("rand") && (
                                            <Grid container sx={{mb: 2}}>
                                                <Grid item xs={4}>
                                                    <Typography variant="h6"
                                                                sx={{fontWeight: 'bold'}}>Mobile</Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <PhoneNumberDisplay phoneNumber={wechatAccount?.phoneNumber}/>
                                                </Grid>
                                            </Grid>
                                        )}
                                        {wechatAccount.wechatQrCodeUrl && (
                                            <Grid container sx={{mb: 2}}>
                                                <Grid item xs={4}>
                                                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>QR
                                                        Code</Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <ImageDisplay imageUrl={wechatAccount.wechatQrCodeUrl}
                                                                  title="Wechat QR Code"/>
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
                                                {/*<Avatar src={wechatAccount.client.profileImageUrl}*/}
                                                {/*        alt={wechatAccount.client.fullName} sx={{mr: 2}}/>*/}
                                                <Typography variant="body1">{wechatAccount.client.fullName}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container sx={{mb: 2}}>
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Email</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography variant="body1">{<EmailDisplay
                                                    email={wechatAccount.client.email}/>}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container sx={{mb: 2}}>
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Mobile</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography
                                                    variant="body1">{<PhoneNumberDisplay
                                                    phoneNumber={wechatAccount?.client?.phoneNumber}/>}</Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            startIcon={<DeleteIcon/>}
                                            onClick={handleDeleteWechatAccountClick}
                                            fullWidth
                                        >
                                            Delete Wechat Account
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
                                        Confirm Delete Wechat Account
                                    </Typography>
                                    <Typography sx={{mt: 2}}>
                                        Are you sure you want to delete this Wechat account? All information about this
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
                {tickAnimationVisible && <TickAnimation successMessage="Wechat Account deleted successfully!"/>}
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

export default WechatAccountDetails;
