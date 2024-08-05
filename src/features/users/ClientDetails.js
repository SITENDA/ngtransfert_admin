import React, {useEffect, useState, useMemo} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import TimeAgo from '../../components/TimeAgo';
import {setItem, selectIsDarkTheme} from '../auth/authSlice';
import {adminPaths} from '../../util/frontend';
import TickAnimation from '../../components/TickAnimation';
import {useDeleteUserMutation, usersApiSlice, useGetUserByUserIdQuery} from './usersSlice';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    createTheme,
    ThemeProvider
} from '@mui/material';
import {darkColor, lightColor} from '../../util/initials';
import MainPageWrapper from "../../components/MainPageWrapper";

const ClientDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const [isDeleteUserModalVisible, setDeleteUserModalVisible] = useState(false);
    const [tickAnimationVisible, setTickAnimationVisible] = useState(false);
    const [user, setUser] = useState(null);
    const {clientId} = useParams();
    const [deleteUser] = useDeleteUserMutation();
    const {data: userData} = useGetUserByUserIdQuery(clientId);

    useEffect(() => {
        dispatch(setItem({key: 'title', value: 'Client Details'}));
    }, [dispatch]);

    const selectPayment = useMemo(
        () => usersApiSlice.endpoints.getUserByUserId.select(clientId),
        [clientId],
    );


    const {data, isSuccess} = useSelector(selectPayment);

    useEffect(() => {
        if (isSuccess && data && data.entities) {
            const info = Object.values(data.entities)[0];
            setUser(info);
        }
    }, [isSuccess, data]);

    const handleSeeLoanDetails = (clientId) => {
        navigate(`${adminPaths.loansByClientPath}/${clientId}`);
    };

    const handleDeleteUserClick = () => {
        setDeleteUserModalVisible(true);
    };

    const handleDeleteOk = async () => {
        const result = await deleteUser(user).unwrap();
        if (result?.message === "Deleted successfully") {
            setTickAnimationVisible(true);
            setTimeout(() => {
                navigate(adminPaths.ClientsListPath);
            }, 3000); // 3000 milliseconds = 3 seconds
        } else {
            //TODO: handle failure cases
        }
        setDeleteUserModalVisible(false);
    };

    const handleDeleteCancel = async () => {
        setDeleteUserModalVisible(false);
    };

    const clientDetails = [
        {title: 'Client name', detail: user?.fullName},
        {title: 'Phone number', detail: user?.phoneNumber},
        {title: 'Email', detail: user?.email},
        {title: 'Gender', detail: user?.gender},
        {title: 'Occupation', detail: user?.occupation || 'None'},
        {title: 'Recommender', detail: user?.recommender},
        {title: 'Registration date', detail: <TimeAgo timestamp={user?.registrationDate}/>},
        {title: 'Number of loans', detail: user?.numberOfLoans && user.numberOfLoans > 0 ? user.numberOfLoans : 'None'}
    ];

    const theme = createTheme({
        palette: {
            mode: isDarkTheme ? 'dark' : 'light',
            background: {
                paper: isDarkTheme ? darkColor : lightColor,
            },
            text: {
                primary: isDarkTheme ? lightColor : darkColor,
            },
        },
    });

    const classNameList = isDarkTheme ? 'text-center mt-5 text-white' : 'text-center mt-5';
    if (!user) {
        return <div className={classNameList}><p className={classNameList}>User not found!</p></div>;
    }

    return (
        <ThemeProvider theme={theme}>
            <MainPageWrapper>
                <Box className="container py-5">
                    <Box className="row justify-content-center">
                        {!tickAnimationVisible && (
                            <Box className="col-lg-8">
                                <TableContainer component={Paper}
                                                style={{backgroundColor: isDarkTheme ? darkColor : lightColor}}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Title</TableCell>
                                                <TableCell>Detail</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {clientDetails.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.title}</TableCell>
                                                    <TableCell>{item.detail}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Box display="flex" justifyContent="space-between" mt={4} width="100%">
                                    <Button variant="contained" color="primary"
                                            onClick={() => handleSeeLoanDetails(user.userId)}>
                                        See loans
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={handleDeleteUserClick}>
                                        Delete User
                                    </Button>
                                </Box>
                            </Box>
                        )}
                        {tickAnimationVisible && <TickAnimation successMessage="User deleted successfully!"/>}
                    </Box>
                    <Dialog
                        open={isDeleteUserModalVisible}
                        onClose={handleDeleteCancel}
                    >
                        <DialogTitle>Confirm Delete Request</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete this user?
                                All information related to this user will be lost.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDeleteCancel} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleDeleteOk} color="secondary">
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </MainPageWrapper>
        </ThemeProvider>
    );
};

export default ClientDetails;

