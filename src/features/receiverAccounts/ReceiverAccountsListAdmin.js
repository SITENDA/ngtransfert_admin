import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {selectIsDarkTheme, setItem} from '../auth/authSlice';
import {useNavigate} from 'react-router-dom';
import {Button, Alert, CircularProgress, Box, ThemeProvider} from '@mui/material';
import {adminPaths} from '../../util/frontend';
import ImageDisplay from '../../components/form-controls/ImageDisplay';
import EmailDisplay from '../../components/form-controls/EmailDisplay';
import PhoneNumberDisplay from '../../components/form-controls/PhoneNumberDisplay';
import Tables from "../../components/Tables";
import TableButton from "../../components/form-controls/TableButton";
import MainPageWrapper from "../../components/MainPageWrapper";
import {useTendaTheme} from "../../components/useTendaTheme";
import {selectAllReceiverAccounts, useGetAllReceiverAccountsQuery} from "./receiverAccountsSlice";
import ReceiverAccountIdentifier from "../../util/ReceiverAccountIdentifier";
import ReceiverAccountType from "../../util/ReceiverAccountType";

const ReceiverAccountsListAdmin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const theme = useTendaTheme();

    useEffect(() => {
        dispatch(setItem({key: "title", value: "All Receiver Accounts"}));
    }, [dispatch]);

    const handleAddAccountClick = () => {
        navigate(adminPaths.addReceiverAccountPath);
    };

    const handleApplyClick = (accountId, receiverAccount) => {
        navigate(adminPaths.applyForTransferPath, {
            state: {
                prevPath: window.location.pathname,
                receiverAccount
            }
        });
    };

    const handleDetailsClick = (accountId, receiverAccount) => {
        navigate(adminPaths.receiverAccountDetailsPath, {
            state: {
                prevPath: window.location.pathname,
                receiverAccount
            }
        });
    };

    const {
        isLoading: isLoadingReceiverAccounts,
        isSuccess: isAllReceiverAccountsSuccess,
        isError: isAllReceiverAccountsError,
        error: allReceiverAccountsError
    } = useGetAllReceiverAccountsQuery();

    const orderedReceiverAccounts = useSelector(selectAllReceiverAccounts);


    const theadLabels = ['Account Name', 'Details', 'Apply'];
    const tbodyContents = orderedReceiverAccounts.map(receiverAccount => [
        <span>{receiverAccount.receiverAccountName} {receiverAccount.receiverAccountIdentifier === ReceiverAccountIdentifier.QR_CODE_IMAGE ?
            <ImageDisplay imageUrl={receiverAccount.qrCodeUrl} title="QR Code"/> :
            receiverAccount.receiverAccountIdentifier === ReceiverAccountIdentifier.EMAIL ?
                <EmailDisplay email={receiverAccount.email}/> :
                receiverAccount.receiverAccountIdentifier === ReceiverAccountIdentifier.PHONE_NUMBER ?
                    <PhoneNumberDisplay phoneNumber={receiverAccount.phoneNumber}/> :
                    receiverAccount.receiverAccountType === ReceiverAccountType.BANK_ACCOUNT ?
                        <ImageDisplay imageUrl={receiverAccount?.bank?.bankLogoUrl}
                                      title={`${receiverAccount?.bank?.bankNameEng} Logo`}/>
                        : null}</span>,
        <TableButton
            onClick={() => handleDetailsClick(receiverAccount?.accountId, receiverAccount)}
            label="Details"
        />,
        <TableButton
            onClick={() => handleApplyClick(receiverAccount?.accountId, receiverAccount)}
            label="Apply"
        />
    ]);

    let content;
    if (isLoadingReceiverAccounts) {
        content = (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress/>
            </Box>
        );
    } else if (orderedReceiverAccounts.length === 0) {
        content = (
            <Alert
                message="No Receiver accounts available"
                type="warning"
                showIcon
            />
        );
    } else if (isAllReceiverAccountsSuccess) {
        content = (
            <Tables
                theadLabels={theadLabels}
                tfootLabels={[]}
                tbodyContents={tbodyContents}
            />
        );
    } else if (isAllReceiverAccountsError) {
        content = <p>Error: {allReceiverAccountsError}</p>;
    }

    return (
        <ThemeProvider theme={theme}>
            <MainPageWrapper>
                <section className={`scrollbar-style ${isDarkTheme ? 'dark-theme' : ''}`}
                         style={{maxHeight: '100vh', overflowY: 'auto', overflowX: 'auto'}}>
                    <Button type='primary' style={{marginBottom: '10px'}} onClick={handleAddAccountClick}>
                        Add a Receiver Account
                    </Button>
                    {content}
                </section>
            </MainPageWrapper>
        </ThemeProvider>
    );
};

export default ReceiverAccountsListAdmin;