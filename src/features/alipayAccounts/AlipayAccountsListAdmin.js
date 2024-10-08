import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsDarkTheme, setItem } from '../auth/authSlice';
import { useNavigate, useParams } from 'react-router-dom';
import {Button, Alert, CircularProgress, Box, ThemeProvider} from '@mui/material';
import { adminPaths } from '../../util/frontend';
import ImageDisplay from '../../components/form-controls/ImageDisplay';
import EmailDisplay from '../../components/form-controls/EmailDisplay';
import PhoneNumberDisplay from '../../components/form-controls/PhoneNumberDisplay';
import Tables from "../../components/Tables";
import TableButton from "../../components/form-controls/TableButton";
import MainPageWrapper from "../../components/MainPageWrapper";
import { useTendaTheme } from "../../components/useTendaTheme";
import {selectAllReceiverAccounts, useGetAllReceiverAccountsQuery} from "../receiverAccounts/receiverAccountsSlice";

const AlipayAccountsListAdmin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const theme = useTendaTheme();

    useEffect(() => {
        dispatch(setItem({ key: "title", value: "All Receiver Accounts" }));
    }, [dispatch]);

    const handleAddAccountClick = () => {
        navigate(adminPaths.addAlipayAccountPath);
    };

    const handleApplyClick = (alipayAccountId, alipayAccount) => {
        navigate(adminPaths.applyForTransferPath, {
            state: {
                prevPath: window.location.pathname,
                alipayAccount
            }
        });
    };

    const handleDetailsClick = (alipayAccountId, alipayAccount) => {
        navigate(adminPaths.alipayAccountDetailsPath, {
            state: {
                prevPath: window.location.pathname,
                alipayAccount
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
        <span>{receiverAccount.alipayAccountName} {receiverAccount.receiverAccountIdentifier === "qrCodeImage" ?
            <ImageDisplay imageUrl={receiverAccount.qrCodeUrl} title="Receiver QR Code"/> :
            receiverAccount.receiverAccountIdentifier === "email" ?
                <EmailDisplay email={receiverAccount.email}/> :
                <PhoneNumberDisplay phoneNumber={receiverAccount.phoneNumber}/>}</span>,
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
                <CircularProgress />
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
                         style={{ maxHeight: '100vh', overflowY: 'auto', overflowX: 'auto' }}>
                    <Button type='primary' style={{ marginBottom: '10px' }} onClick={handleAddAccountClick}>
                        Add an Alipay Account
                    </Button>
                    {content}
                </section>
            </MainPageWrapper>
        </ThemeProvider>
    );
};

export default AlipayAccountsListAdmin;