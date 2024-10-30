import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, selectIsDarkTheme, setItem } from '../auth/authSlice';
import { useNavigate, useParams } from 'react-router-dom';
import {Button, Alert, CircularProgress, Box, ThemeProvider, Divider} from '@mui/material';
import { adminPaths } from '../../util/frontend';
import Tables from "../../components/Tables";
import TableButton from "../../components/form-controls/TableButton";
import MainPageWrapper from "../../components/MainPageWrapper";
import {useTendaTheme} from "../../hooks/useTendaTheme";
import {
    selectAllIndividualReceiverAccounts,
    useGetReceiverAccountsByClientIdQuery
} from "./receiverAccountsSlice";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import {darkColor, lightColor} from "../../util/initials";
import Select from "react-select";
import {orderedReceiverAccountTypes} from "../../util/ReceiverAccountType";
import SelectedMethodDisplay from "../../components/form-controls/SelectedMethodDisplay";
import useSelectStyles from "../../hooks/useSelectStyles";

const ReceiverAccountsByClientList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const params = useParams();
    const user = useSelector(selectCurrentUser);
    const theme = useTendaTheme();

    const { clientId } = params;

     // State to track the selected filter option
    const [selectedAccountType, setSelectedAccountType] = useState(null);
    const selectStyles = useSelectStyles(isDarkTheme, darkColor, lightColor);

    useEffect(() => {
        dispatch(setItem({ key: "title", value: "Receiver Accounts for Client" }));
    }, [dispatch]);

    const handleAddAccountClick = () => {
        navigate(adminPaths.addReceiverAccountPath);
    };

    const handleTopUpClick = (e, receiverAccount) => {
        e.preventDefault();
        navigate(adminPaths.topUpInstructionsPath, {
            state: {
                prevPath: window.location.pathname,
                receiverAccount,
            }
        });
    }

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





    // Dropdown options, including "All" for showing all accounts
    const icons = orderedReceiverAccountTypes.map((accountType) => (
        <span style={{marginLeft: '20px'}}> {accountType.icon} </span>))
    const accountTypeOptions = [
        {value: 'all', label: <>All {icons}</>},
        ...orderedReceiverAccountTypes.map((accountType) => ({
            value: accountType.value,
            label: (<SelectedMethodDisplay orderedReceiverAccountType={accountType}/>),
        }))
    ];

    const handleFilterChange = (selectedOption) => {
        setSelectedAccountType(selectedOption.value);
    };

    const orderedReceiverAccounts = useSelector(state => selectAllIndividualReceiverAccounts(state, user?.userId));


    // Filter the accounts based on selected account type
    const filteredReceiverAccounts = selectedAccountType === 'all' || !selectedAccountType
        ? orderedReceiverAccounts // Show all accounts if "All" is selected
        : orderedReceiverAccounts.filter(receiverAccount =>
            receiverAccount.receiverAccountType === selectedAccountType
        );



    const theadLabels = ['Account Name', 'Top Up', 'Apply'];
    const tbodyContents = filteredReceiverAccounts.map(receiverAccount => [
        <span>{receiverAccount.receiverAccountName} <br/><TableButton
            onClick={() => handleDetailsClick(receiverAccount?.accountId, receiverAccount)}
            label="Details"
        /></span>,

        <Button
            variant="contained"
            sx={{backgroundColor: '#4CAF50', color: '#fff'}} // Change to a green color
            startIcon={<MonetizationOnIcon/>}
            onClick={(e) => handleTopUpClick(e, receiverAccount)}
        >
            Top Up
        </Button>,
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
                         style={{maxHeight: '100vh', overflowY: 'auto', overflowX: 'auto'}}>

                    <Button type='primary' style={{marginBottom: '10px'}} onClick={handleAddAccountClick}>
                        Add a Receiver Account
                    </Button>

                    <Divider sx={{mb: 2}}/>

                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                        <label htmlFor="accountTypeSelector"
                               style={{marginRight: '20px', color: isDarkTheme ? lightColor : darkColor}}>
                            Category
                        </label>
                        <Select
                            id="accountTypeSelector"
                            options={accountTypeOptions}
                            onChange={handleFilterChange}
                            defaultValue={accountTypeOptions[0]} // Default to "All"
                            placeholder="Select account type"
                            isSearchable={false}
                            menuPlacement="auto"
                            menuPosition="fixed"
                            styles={{
                                ...selectStyles,
                                container: (provided) => ({
                                    ...provided,
                                    width: '200px',  // Adjust the width as needed
                                }),
                            }}
                        />
                    </div>

                    {content}
                </section>
            </MainPageWrapper>
        </ThemeProvider>
    );
};

export default ReceiverAccountsByClientList;