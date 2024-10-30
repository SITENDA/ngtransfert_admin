import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {selectCurrentUser, selectIsDarkTheme, setItem} from '../auth/authSlice';
import {selectAllIndividualWechatAccounts, useGetWechatAccountsByClientIdQuery} from './wechatAccountsSlice';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, Alert, CircularProgress, Box, ThemeProvider} from '@mui/material';
import {adminPaths} from '../../util/frontend';
import ImageDisplay from '../../components/form-controls/ImageDisplay';
import EmailDisplay from '../../components/form-controls/EmailDisplay';
import PhoneNumberDisplay from '../../components/form-controls/PhoneNumberDisplay';
import Tables from "../../components/Tables";
import TableButton from "../../components/form-controls/TableButton";
import MainPageWrapper from "../../components/MainPageWrapper";
import {useTendaTheme} from "../../hooks/useTendaTheme";

const WechatAccountsByClientList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const params = useParams();
    const user = useSelector(selectCurrentUser);
    const theme = useTendaTheme();

    const {clientId} = params;

    useEffect(() => {
        dispatch(setItem({key: "title", value: "Wechat Accounts"}));
    }, [dispatch]);

    const handleAddAccountClick = () => {
        navigate(adminPaths.addWechatAccountPath);
    };

    const handleDetailsClick = (wechatAccountId, wechatAccount) => {
        navigate(adminPaths.wechatAccountDetailsPath, {
            state: {
                prevPath: window.location.pathname,
                wechatAccount
            }
        });
    };

    const handleApplyClick = (wechatAccountId, wechatAccount) => {
        navigate(adminPaths.applyForTransferPath, {
            state: {
                prevPath: window.location.pathname,
                wechatAccount
            }
        });
    };

    const {
        isLoading: isAllWechatAccountsLoading,
        isSuccess: isAllWechatAccountsSuccess,
        isError: isAllWechatAccountsError,
        error: allWechatAccountsError
    } = useGetWechatAccountsByClientIdQuery(user.userId);

    const orderedWechatAccounts = useSelector(state => selectAllIndividualWechatAccounts(state, user?.userId));

    let filteredWechatAccounts = orderedWechatAccounts;

    // Filter wechatAccounts based on the given clientId
    if (clientId) {
        filteredWechatAccounts = orderedWechatAccounts.filter(account => Number(account.clientId) === Number(clientId));
    }

    const theadLabels = ['Account Name', 'Details', 'Apply'];
    const tbodyContents = filteredWechatAccounts.map(wechatAccount => [
        <span>{wechatAccount.wechatAccountName} {wechatAccount.wechatAccountIdentifier === "qrCodeImage" ?
            <ImageDisplay imageUrl={wechatAccount.wechatQrCodeUrl} title="Wechat QR Code"/> :
            wechatAccount.wechatAccountIdentifier === "email" ?
                <EmailDisplay email={wechatAccount.email}/> :
                <PhoneNumberDisplay phoneNumber={wechatAccount.phoneNumber}/>}
        </span>,
        <TableButton
            onClick={() => handleDetailsClick(wechatAccount?.wechatAccountId, wechatAccount)}
            label="Details"
        />,
        <TableButton
            onClick={() => handleApplyClick(wechatAccount?.wechatAccountId, wechatAccount)}
            label="Apply"
        />
    ]);

    let content;
    if (isAllWechatAccountsLoading) {
        content = (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress/>
            </Box>
        );
    } else if (orderedWechatAccounts.length === 0) {
        content = (
            <Alert
                message="No Wechat accounts available"
                type="warning"
                showIcon
            />
        );
    } else if (isAllWechatAccountsSuccess) {
        content = (
            <Tables
                theadLabels={theadLabels}
                tfootLabels={[]}
                tbodyContents={tbodyContents}
            />
        );
    } else if (isAllWechatAccountsError) {
        content = <p>Error: {allWechatAccountsError}</p>;
    }

    return (
        <ThemeProvider theme={theme}>
            <MainPageWrapper>
                <section className={`scrollbar-style ${isDarkTheme ? 'dark-theme' : ''}`}
                         style={{maxHeight: '500px', overflowY: 'auto', overflowX: 'auto'}}>
                    <Button type='primary' style={{marginBottom: '10px'}} onClick={handleAddAccountClick}>
                        Add a Wechat Account
                    </Button>
                    {content}
                </section>
            </MainPageWrapper>
        </ThemeProvider>
    );
};

export default WechatAccountsByClientList;