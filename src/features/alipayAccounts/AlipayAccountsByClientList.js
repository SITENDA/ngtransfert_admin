import  { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectIsDarkTheme, setItem } from '../auth/authSlice';
import { selectAllIndividualAlipayAccounts, useGetAlipayAccountsByClientIdQuery } from './alipayAccountsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import {Button, Alert, CircularProgress, Box, ThemeProvider} from '@mui/material';
import { adminPaths } from '../../util/frontend';
import ImageDisplay from '../../components/form-controls/ImageDisplay';
import EmailDisplay from '../../components/form-controls/EmailDisplay';
import PhoneNumberDisplay from '../../components/form-controls/PhoneNumberDisplay';
import Tables from "../../components/Tables";
import TableButton from "../../components/form-controls/TableButton";
import MainPageWrapper from "../../components/MainPageWrapper";
import {useTendaTheme} from "../../components/useTendaTheme";

const AlipayAccountsByClientList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const params = useParams();
    const user = useSelector(selectCurrentUser);
    const theme = useTendaTheme();

    const { clientId } = params;

    useEffect(() => {
        dispatch(setItem({ key: "title", value: "Alipay Accounts" }));
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
        isLoading: isLoadingAlipayAccounts,
        isSuccess: isAllAlipayAccountsSuccess,
        isError: isAllAlipayAccountsError,
        error: allAlipayAccountsError
    } = useGetAlipayAccountsByClientIdQuery(user.userId);

    const orderedAlipayAccounts = useSelector(state => selectAllIndividualAlipayAccounts(state, user?.userId));

    let filteredAlipayAccounts = orderedAlipayAccounts;

    // Filter alipayAccounts based on the given clientId
    if (clientId) {
        filteredAlipayAccounts = orderedAlipayAccounts.filter(account => Number(account.clientId) === Number(clientId));
    }

    const theadLabels = ['Account Name', 'Details', 'Apply'];
    const tbodyContents = filteredAlipayAccounts.map(alipayAccount => [
        <span>{alipayAccount.alipayAccountName} {alipayAccount.alipayAccountIdentifier === "qrCodeImage" ?
            <ImageDisplay imageUrl={alipayAccount.alipayQrCodeUrl} title="Alipay QR Code"/> :
            alipayAccount.alipayAccountIdentifier === "email" ?
                <EmailDisplay email={alipayAccount.email}/> :
                <PhoneNumberDisplay phoneNumber={alipayAccount.phoneNumber}/>}</span>,
        <TableButton
            onClick={() => handleDetailsClick(alipayAccount?.alipayAccountId, alipayAccount)}
            label="Details"
        />,
        <TableButton
            onClick={() => handleApplyClick(alipayAccount?.alipayAccountId, alipayAccount)}
            label="Apply"
        />
    ]);

    let content;
    if (isLoadingAlipayAccounts) {
        content = (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    } else if (orderedAlipayAccounts.length === 0) {
        content = (
            <Alert
                message="No Alipay accounts available"
                type="warning"
                showIcon
            />
        );
    } else if (isAllAlipayAccountsSuccess) {
        content = (
            <Tables
                theadLabels={theadLabels}
                tfootLabels={[]}
                tbodyContents={tbodyContents}
            />
        );
    } else if (isAllAlipayAccountsError) {
        content = <p>Error: {allAlipayAccountsError}</p>;
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

export default AlipayAccountsByClientList;