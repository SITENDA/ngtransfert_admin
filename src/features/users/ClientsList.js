import React, { useEffect } from 'react';
import { useGetAllClientsQuery, selectAllClients } from './usersSlice';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, setItem, selectIsDarkTheme } from '../auth/authSlice';
import Tables from '../../components/Tables';
import TimeAgo from '../../components/TimeAgo';
import { useNavigate } from 'react-router-dom';
import NotAvailable from '../../components/NotAvailable';
import { adminPaths } from '../../util/frontend';
import TableButton from "../../components/form-controls/TableButton";
import MainPageWrapper from "../../components/MainPageWrapper";
import { ThemeProvider, createTheme, Container, CircularProgress, Box, Alert } from '@mui/material';
import { darkColor, lightColor } from '../../util/initials';

const IsLoadingComponent = <CircularProgress />;
const theadLabels = ["Name", "Registration Date", "Number of loans", "Details"];

const ClientsList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isDarkTheme = useSelector(selectIsDarkTheme);

    const handleDetailsClick = (clientId, client) => {
        navigate(`${adminPaths.clientDetailsPath}/${clientId}`, { state: { prevPath: window.location.pathname, client: client } });
    };

    useEffect(() => {
        dispatch(setItem({ key: "title", value: "Clients" }));
    }, [dispatch]);

    const {
        data: allClientsData,
        isLoading: isClientsLoading,
        isSuccess: isClientsSuccess,
        isError: isClientsError,
        error: clientsError
    } = useGetAllClientsQuery();

    const orderedClients = useSelector(selectAllClients);

    let tbodyContents = orderedClients.map(client => {
        return [
            client.fullName,
            <TimeAgo timestamp={client.registrationDate} />,
            client.numberOfLoans,
            <TableButton
                onClick={() => handleDetailsClick(client.userId, client)}
                label="Details"
            />
        ];
    });

    let content;
    if (isClientsLoading) {
        content = IsLoadingComponent;
    } else if (isClientsSuccess) {
        if (orderedClients.length === 0) {
            content = <NotAvailable item="clients" />;
        } else {
            content = <Tables theadLabels={theadLabels} tfootLabels={[]} tbodyContents={tbodyContents} />;
        }
    } else if (isClientsError) {
        content = <Alert severity="error">Error: {clientsError}</Alert>;
    }

    const theme = createTheme({
        palette: {
            mode: isDarkTheme ? 'dark' : 'light',
            background: {
                default: isDarkTheme ? darkColor : lightColor,
                paper: isDarkTheme ? darkColor : lightColor,
            },
            text: {
                primary: isDarkTheme ? lightColor : darkColor,
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <MainPageWrapper>
                <Container>
                    <Box sx={{ my: 4 }}>
                        {content}
                    </Box>
                </Container>
            </MainPageWrapper>
        </ThemeProvider>
    );
};

export default ClientsList;
