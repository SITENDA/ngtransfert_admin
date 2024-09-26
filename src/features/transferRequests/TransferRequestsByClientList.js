import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {selectCurrentUser, selectIsDarkTheme, setItem} from '../auth/authSlice';
import {useGetTransferRequestsByClientIdQuery} from './transferRequestsSlice';
import {useNavigate, useParams} from 'react-router-dom';
import {Alert, CircularProgress, Box, ThemeProvider} from '@mui/material';
import {adminPaths} from '../../util/frontend';
import ImageDisplay from '../../components/form-controls/ImageDisplay';
import Tables from "../../components/Tables";
import TableButton from "../../components/form-controls/TableButton";
import MainPageWrapper from "../../components/MainPageWrapper";
import {useTendaTheme} from "../../components/useTendaTheme";

const TransferRequestsByClientList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const params = useParams();
    const user = useSelector(selectCurrentUser);
    const theme = useTendaTheme();

    const {clientId} = params;

    useEffect(() => {
        dispatch(setItem({key: "title", value: "Transfer Requests"}));
    }, [dispatch]);

    const handleDetailsClick = (transferRequestId, transferRequest) => {
        navigate(adminPaths.transferRequestDetailsPath, {
            state: {
                prevPath: window.location.pathname,
                transferRequest
            }
        });
    };

    const {
        data: transferRequestsForClient,
        isLoading: isAllTransferRequestsLoading,
        isSuccess: isAllTransferRequestsSuccess,
        isError: isAllTransferRequestsError,
        error: allTransferRequestsError
    } = useGetTransferRequestsByClientIdQuery(user.userId);

    const orderedTransferRequests = transferRequestsForClient ? Object.values(transferRequestsForClient.entities) : [];

    let filteredTransferRequests = orderedTransferRequests;

    // Filter transferRequests based on the given clientId
    if (clientId) {
        filteredTransferRequests = orderedTransferRequests.filter(account => Number(account.clientId) === Number(clientId));
    }

    const theadLabels = ['Amount', 'Details', 'Country of Deposit'];
    const tbodyContents = filteredTransferRequests.map(transferRequest => [
        transferRequest.amount,
        <TableButton
            onClick={() => handleDetailsClick(transferRequest?.transferRequestId, transferRequest)}
            label="Details"
        />,
        <ImageDisplay imageUrl={transferRequest?.countryOfDeposit?.countryFlagUrl}
                      title={`${transferRequest?.countryOfDeposit?.countryName} Flag`}/>,
    ]);

    let content;
    if (isAllTransferRequestsLoading) {
        content = (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress/>
            </Box>
        );
    } else if (orderedTransferRequests.length === 0) {
        content = (
            <Alert
                message="No transfer requests available"
                type="warning"
                showIcon
            />
        );
    } else if (isAllTransferRequestsSuccess) {
        content = (
            <Tables
                theadLabels={theadLabels}
                tfootLabels={[]}
                tbodyContents={tbodyContents}
            />
        );
    } else if (isAllTransferRequestsError) {
        content = <p>Error: {allTransferRequestsError}</p>;
    }

    return (
        <ThemeProvider theme={theme}>
            <MainPageWrapper>
                <section className={`scrollbar-style ${isDarkTheme ? 'dark-theme' : ''}`}
                         style={{maxHeight: '500px', overflowY: 'auto', overflowX: 'auto'}}>
                    {content}
                </section>
            </MainPageWrapper>
        </ThemeProvider>
    );
};

export default TransferRequestsByClientList;