import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {selectCurrentUser, selectIsDarkTheme, setItem} from '../auth/authSlice';
import {
    selectAllTransferRequests,
    useGetAllTransferRequestsQuery,
} from '../transferRequests/transferRequestsSlice';
import {useNavigate, useParams} from 'react-router-dom';
import {Alert, CircularProgress, Box, ThemeProvider} from '@mui/material';
import {adminPaths} from '../../util/frontend';
import ImageDisplay from '../../components/form-controls/ImageDisplay';
import Tables from "../../components/Tables";
import TableButton from "../../components/form-controls/TableButton";
import MainPageWrapper from "../../components/MainPageWrapper";
import {useTendaTheme} from "../../components/useTendaTheme";

const ApprovedTransfersListAdmin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const params = useParams();
    const user = useSelector(selectCurrentUser);
    const theme = useTendaTheme();
    const [transferRequests, setTransferRequests] = useState([]);

    const {clientId} = params;

    useEffect(() => {
        dispatch(setItem({key: "title", value: "Approved Transfers"}));
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
        isLoading: isAllTransferRequestsLoading,
        isSuccess: isAllTransferRequestsSuccess,
        isError: isAllTransferRequestsError,
        error: allTransferRequestsError
    } = useGetAllTransferRequestsQuery();

    const orderedTransferRequests = useSelector(selectAllTransferRequests);

    useEffect(() => {
        if (isAllTransferRequestsSuccess) {
            setTransferRequests(orderedTransferRequests)
        }
    }, [isAllTransferRequestsSuccess, orderedTransferRequests]);

    const theadLabels = ['Amount', 'Details', 'Country of Deposit'];
    const tbodyContents = transferRequests.map(transferRequest => [
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

export default ApprovedTransfersListAdmin;