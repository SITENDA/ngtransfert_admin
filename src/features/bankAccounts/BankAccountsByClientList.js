import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, setItem } from '../auth/authSlice';
import { selectAllIndividualBankAccounts, useGetBankAccountsByClientIdQuery } from './bankAccountsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import {Button, Alert, CircularProgress, Box, ThemeProvider} from '@mui/material';
import { adminPaths } from '../../util/frontend';
import BankAccountNumberDisplay from '../../components/form-controls/BankAccountNumberDisplay';
import ImageDisplay from '../../components/form-controls/ImageDisplay';
import Tables from "../../components/Tables";
import TableButton from "../../components/form-controls/TableButton";
import MainPageWrapper from "../../components/MainPageWrapper";
import { useTendaTheme } from "../../hooks/useTendaTheme";

const BankAccountsByClientList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const user = useSelector(selectCurrentUser);
    const theme = useTendaTheme();

    const { clientId } = params;

    useEffect(() => {
        dispatch(setItem({ key: "title", value: "Bank Accounts" }));
    }, [dispatch]);

    const handleAddAccountClick = () => {
        navigate(adminPaths.addBankAccountPath);
    };

    const handleDetailsClick = (bankAccountId, bankAccount) => {
        navigate(adminPaths.bankAccountDetailsPath, {
            state: {
                prevPath: window.location.pathname,
                bankAccount
            }
        });
    };

    const {
        isLoading: isLoadingBankAccounts,
        isSuccess: isAllBankAccountsSuccess,
        isError: isAllBankAccountsError,
        error: allBankAccountsError
    } = useGetBankAccountsByClientIdQuery(user.userId);

    const orderedBankAccounts = useSelector(state => selectAllIndividualBankAccounts(state, user?.userId));

    let filteredBankAccounts = orderedBankAccounts;

    // Filter bankAccounts based on the given clientId
    if (clientId) {
        filteredBankAccounts = orderedBankAccounts.filter(account => Number(account.clientId) === Number(clientId));
    }

    const theadLabels = ['Account Name', 'Details', 'Account No', 'Bank'];
    const tbodyContents = filteredBankAccounts.map(account => [
        account.cardHolderName,
        <TableButton
            onClick={() => handleDetailsClick(account?.bankAccountId, account)}
            label="Details"
        />,
        <BankAccountNumberDisplay bankAccountNumber={account.bankAccountNumber} />,
        <ImageDisplay imageUrl={account.bank.bankLogoUrl} title={account.bank.bankNameEng} />
    ]);

    let content;
    if (isLoadingBankAccounts) {
        content = (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    } else if (orderedBankAccounts.length === 0) {
        content = (
            <Alert
                message="No Bank accounts available"
                type="warning"
                showIcon
            />
        );
    } else if (isAllBankAccountsSuccess) {
        content = (
            <Tables
                theadLabels={theadLabels}
                tfootLabels={[]}
                tbodyContents={tbodyContents}
            />
        );
    } else if (isAllBankAccountsError) {
        content = <p>Error: {allBankAccountsError}</p>;
    }

    return (
        <ThemeProvider theme={theme}>
            <MainPageWrapper>
                <section>
                    <Button type='primary' style={{ marginBottom: '10px' }} onClick={handleAddAccountClick}>
                        Add a Bank Account
                    </Button>
                    {content}
                </section>
            </MainPageWrapper>
        </ThemeProvider>
    );
};

export default BankAccountsByClientList;