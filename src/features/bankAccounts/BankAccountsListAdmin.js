import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {selectCurrentUser, selectIsDarkTheme, setItem} from '../auth/authSlice';
import {
    selectAllBankAccounts,
    useGetAllBankAccountsQuery,
} from './bankAccountsSlice';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, Alert, CircularProgress, Box, ThemeProvider} from '@mui/material';
import {adminPaths} from '../../util/frontend';
import BankAccountNumberDisplay from '../../components/form-controls/BankAccountNumberDisplay';
import ImageDisplay from '../../components/form-controls/ImageDisplay';
import Tables from "../../components/Tables";
import TableButton from "../../components/form-controls/TableButton";
import MainPageWrapper from "../../components/MainPageWrapper";
import {useTendaTheme} from "../../hooks/useTendaTheme";

const BankAccountsListAdmin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const user = useSelector(selectCurrentUser);
    const theme = useTendaTheme();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const [bankAccounts, setBankAccounts] = React.useState([]);

    useEffect(() => {
        dispatch(setItem({key: "title", value: "Bank Accounts"}));
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
    } = useGetAllBankAccountsQuery();

    const orderedBankAccounts = useSelector(selectAllBankAccounts);

    useEffect(() => {
        if (isAllBankAccountsSuccess) {
            console.log("Data fetched, ordered bank accounts : ", orderedBankAccounts);
            setBankAccounts(orderedBankAccounts)
        }
    }, [orderedBankAccounts, isAllBankAccountsSuccess, dispatch]);


    const theadLabels = ['Account Name', 'Details', 'Account No', 'Bank'];
    const tbodyContents = bankAccounts.map(account => [
        account.cardHolderName,
        <TableButton
            onClick={() => handleDetailsClick(account?.bankAccountId, account)}
            label="Details"
        />,
        <BankAccountNumberDisplay bankAccountNumber={account?.bankAccountNumber}/>,
        <ImageDisplay imageUrl={account?.bank?.bankLogoUrl} title={account?.bank?.bankNameEng}/>
    ]);

    let content;
    if (isLoadingBankAccounts) {
        content = (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress/>
            </Box>
        );
    } else if (isAllBankAccountsSuccess) {
        if (orderedBankAccounts.length === 0) {
            content = (
                <Alert
                    message="No Bank accounts available"
                    type="warning"
                    showIcon
                />
            )
        } else if (isAllBankAccountsError) {
            content = <p>Error: {allBankAccountsError}</p>;
        } else
            content = (
                <Tables
                    theadLabels={theadLabels}
                    tfootLabels={[]}
                    tbodyContents={tbodyContents}
                />
            );
    }

    return (
        <ThemeProvider theme={theme}>
            <MainPageWrapper>
                <section className={`scrollbar-style ${isDarkTheme ? 'dark-theme' : ''}`}
                         style={{maxHeight: '100vh', overflowY: 'auto', overflowX: 'auto'}}>
                    <Button type='primary' style={{marginBottom: '10px'}} onClick={handleAddAccountClick}>
                        Add a Bank Account
                    </Button>
                    {content}
                </section>
            </MainPageWrapper>
        </ThemeProvider>
    );
};

export default BankAccountsListAdmin;