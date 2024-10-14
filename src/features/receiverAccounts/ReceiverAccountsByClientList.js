import  { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectIsDarkTheme, setItem } from '../auth/authSlice';
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
import ReceiverAccountIdentifier from "../../util/ReceiverAccountIdentifier";
import {selectAllIndividualReceiverAccounts, useGetReceiverAccountsByClientIdQuery} from "./receiverAccountsSlice";

const ReceiverAccountsByClientList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const params = useParams();
    const user = useSelector(selectCurrentUser);
    const theme = useTendaTheme();

    const { clientId } = params;

    useEffect(() => {
        dispatch(setItem({ key: "title", value: "Receiver Accounts for client" }));
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
    } = useGetReceiverAccountsByClientIdQuery(user.userId);

    const orderedReceiverAccounts = useSelector(state => selectAllIndividualReceiverAccounts(state, user?.userId));

    let filteredReceiverAccounts = orderedReceiverAccounts;

    // Filter receiverAccounts based on the given clientId
    if (clientId) {
        filteredReceiverAccounts = orderedReceiverAccounts.filter(account => Number(account.clientId) === Number(clientId));
    }

    const theadLabels = ['Account Name', 'Details', 'Apply'];
    const tbodyContents = filteredReceiverAccounts.map(receiverAccount => [
        <span>{receiverAccount.receiverAccountName} {receiverAccount.receiverAccountIdentifier === ReceiverAccountIdentifier.QR_CODE_IMAGE ?
            <ImageDisplay imageUrl={receiverAccount.qrCodeUrl} title="QR Code"/> :
            receiverAccount.receiverAccountIdentifier === ReceiverAccountIdentifier.EMAIL ?
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
                        Add a Receiver Account
                    </Button>
                    {content}
                </section>
            </MainPageWrapper>
        </ThemeProvider>
    );
};

export default ReceiverAccountsByClientList;