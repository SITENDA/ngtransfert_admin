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
import DeleteIcon from '@mui/icons-material/Delete';
import {useDeleteTransferRequestMutation} from "./transferRequestsSlice";
import TickAnimation from '../../components/TickAnimation';
import {adminPaths} from '../../util/frontend';
import {darkColor, lightColor} from "../../util/initials";
import MainPageWrapper from "../../components/MainPageWrapper";
import ImageDisplay from "../../components/form-controls/ImageDisplay";
import EmailDisplay from "../../components/form-controls/EmailDisplay";
import PhoneNumberDisplay from "../../components/form-controls/PhoneNumberDisplay";
import SendIcon from "@mui/icons-material/Send";

const TransferRequestDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const [isDeleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
    const [deleteTransferRequest] = useDeleteTransferRequestMutation();
    const [tickAnimationVisible, setTickAnimationVisible] = useState(false);

    useEffect(() => {
        dispatch(setItem({key: "title", value: "Transfer Request Details"}));
    }, [dispatch]);

    let transferRequest = location?.state?.transferRequest;

    const handleDeleteOk = async () => {
        const response = await deleteTransferRequest(transferRequest).unwrap();
        if (response?.statusCode === 200 && response?.message === "Transfer request deleted successfully") {
            setTickAnimationVisible(true);
            setTimeout(() => {
                navigate(adminPaths.transferRequestsPath);
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

    const handleApproveTransferClick = () => {
        //Approve transfer code
    }

    if (!transferRequest) {
        return <Typography align="center" color="error" variant="h5" sx={{mt: 5}}>Transfer request not
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
                                    <CardContent>
                                        {/* Account Details Section */}
                                        <Typography variant="h5" gutterBottom>Account Details</Typography>
                                        <Divider sx={{mb: 2}}/>
                                        <Grid container sx={{mb: 2}}>
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Amount</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography
                                                    variant="body1">{`${transferRequest?.currency?.currencyCode} ${transferRequest.amount}`}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Divider sx={{mb: 2}}/>
                                        <Divider sx={{mb: 2}}/>
                                        <Grid container sx={{mb: 2}}>
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Rate</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography
                                                    variant="body1">{`${transferRequest.rate} %`}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Divider sx={{mb: 2}}/>
                                        <Grid container sx={{mb: 2}}>
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Remark</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography
                                                    variant="body1">{transferRequest.remark}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container sx={{mb: 2}}>
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Status</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography
                                                    variant="body1">{transferRequest?.isRequestSettled ? "Settled" : "Not yet settled"}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Divider sx={{mb: 2}}/>
                                        {transferRequest?.countryOfDeposit && (
                                            <Grid container sx={{mb: 2}}>
                                                <Grid item xs={4}>
                                                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>Country of
                                                        deposit</Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <ImageDisplay
                                                        imageUrl={transferRequest?.countryOfDeposit?.countryFlagUrl}
                                                        title={`${transferRequest?.countryOfDeposit?.countryName}Flag`}/>
                                                    <Typography variant="h6"
                                                                sx={{fontWeight: 'normal'}}>{transferRequest?.countryOfDeposit?.countryName}</Typography>
                                                </Grid>
                                            </Grid>
                                        )}
                                        <Divider sx={{my: 3}}/>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            variant="contained"
                                            color="primary" // Change to primary color for a positive action
                                            startIcon={<SendIcon/>} // Use SendIcon for transfer action
                                            onClick={handleApproveTransferClick}
                                            fullWidth
                                        >
                                            Approve transfer
                                        </Button>
                                    </CardActions>
                                    <CardContent>

                                        <Typography variant="h5" gutterBottom>Receiver Account Details</Typography>
                                        <Divider sx={{mb: 2}}/>
                                        <Grid container sx={{mb: 2}} alignItems="center">
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Name</Typography>
                                            </Grid>
                                            <Grid item xs={8} container alignItems="center">
                                                <Typography
                                                    variant="body1">{transferRequest?.receiverAccount.accountName}</Typography>
                                            </Grid>
                                        </Grid>

                                        {/* Client Details Section */}
                                        <Typography variant="h5" gutterBottom>Client Details</Typography>
                                        <Divider sx={{mb: 2}}/>
                                        <Grid container sx={{mb: 2}} alignItems="center">
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Name</Typography>
                                            </Grid>
                                            <Grid item xs={8} container alignItems="center">
                                                <Typography
                                                    variant="body1">{transferRequest.client.fullName}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container sx={{mb: 2}}>
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Email</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography variant="body1">{<EmailDisplay
                                                    email={transferRequest.client.email}/>}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container sx={{mb: 2}}>
                                            <Grid item xs={4}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>Mobile</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography
                                                    variant="body1"><PhoneNumberDisplay
                                                    phoneNumber={transferRequest.client.phoneNumber}/></Typography>
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
                                            Delete Transfer Request
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
                                        Confirm Delete Transfer Request
                                    </Typography>
                                    <Typography sx={{mt: 2}}>
                                        Are you sure you want to delete this Transfer request? All information about
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
                {tickAnimationVisible && <TickAnimation successMessage="Transfer Request deleted successfully!"/>}
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

export default TransferRequestDetails;
