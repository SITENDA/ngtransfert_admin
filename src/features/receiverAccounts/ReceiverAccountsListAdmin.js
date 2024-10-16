import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {selectIsDarkTheme, setItem} from '../auth/authSlice';
import {useNavigate} from 'react-router-dom';
import {Button, Alert, CircularProgress, Box, ThemeProvider, Divider} from '@mui/material';
import Select from 'react-select'; // Import react-select
import {adminPaths} from '../../util/frontend';
import ImageDisplay from '../../components/form-controls/ImageDisplay';
import EmailDisplay from '../../components/form-controls/EmailDisplay';
import PhoneNumberDisplay from '../../components/form-controls/PhoneNumberDisplay';
import Tables from "../../components/Tables";
import TableButton from "../../components/form-controls/TableButton";
import MainPageWrapper from "../../components/MainPageWrapper";
import {useTendaTheme} from "../../components/useTendaTheme";
import {selectAllReceiverAccounts, useGetAllReceiverAccountsQuery} from "./receiverAccountsSlice";
import ReceiverAccountIdentifier from "../../util/ReceiverAccountIdentifier";
import ReceiverAccountType, {orderedReceiverAccountTypes} from "../../util/ReceiverAccountType";
import {darkColor, lightColor} from "../../util/initials";
import useSelectStyles from "../../hooks/useSelectStyles";
import SelectedMethodDisplay from "../../components/form-controls/SelectedMethodDisplay";
import {faWeixin} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const ReceiverAccountsListAdmin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const theme = useTendaTheme();

    // State to track the selected filter option
    const [selectedAccountType, setSelectedAccountType] = useState(null);
    const selectStyles = useSelectStyles(isDarkTheme, darkColor, lightColor);

    useEffect(() => {
        dispatch(setItem({key: "title", value: "All Receiver Accounts"}));
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
    } = useGetAllReceiverAccountsQuery();

    const orderedReceiverAccounts = useSelector(selectAllReceiverAccounts);

    // Dropdown options, including "All" for showing all accounts
    const icons = orderedReceiverAccountTypes.map((accountType) => (<span style={{marginLeft: '20px'}}> {accountType.icon} </span>))
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

    // Filter the accounts based on selected account type
    const filteredReceiverAccounts = selectedAccountType === 'all' || !selectedAccountType
        ? orderedReceiverAccounts // Show all accounts if "All" is selected
        : orderedReceiverAccounts.filter(receiverAccount =>
            receiverAccount.receiverAccountType === selectedAccountType
        );

    const theadLabels = ['Account Name', 'Details', 'Apply'];
    const tbodyContents = filteredReceiverAccounts.map(receiverAccount => [
        <span>{receiverAccount.receiverAccountName} {receiverAccount.receiverAccountIdentifier === ReceiverAccountIdentifier.QR_CODE_IMAGE ?
            <ImageDisplay imageUrl={receiverAccount.qrCodeUrl} title="QR Code"/> :
            receiverAccount.receiverAccountIdentifier === ReceiverAccountIdentifier.EMAIL ?
                <EmailDisplay email={receiverAccount.email}/> :
                receiverAccount.receiverAccountIdentifier === ReceiverAccountIdentifier.PHONE_NUMBER ?
                    <PhoneNumberDisplay phoneNumber={receiverAccount.phoneNumber}/> :
                    receiverAccount.receiverAccountType === ReceiverAccountType.BANK_ACCOUNT ?
                        <ImageDisplay imageUrl={receiverAccount?.bank?.bankLogoUrl}
                                      title={`${receiverAccount?.bank?.bankNameEng} Logo`}/>
                        : null}</span>,
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
                <CircularProgress/>
            </Box>
        );
    } else if (filteredReceiverAccounts.length === 0) {
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
                    {/* Dropdown for filtering by account type */}
                    <Select
                        options={accountTypeOptions}
                        onChange={handleFilterChange}
                        defaultValue={accountTypeOptions[0]} // Default to "All"
                        placeholder="Select account type"
                        styles={selectStyles}
                    />
                    <Divider sx={{mb: 2}}/>

                    <Button type='primary' style={{marginBottom: '10px'}} onClick={handleAddAccountClick}>
                        Add a Receiver Account
                    </Button>
                    {content}
                </section>
            </MainPageWrapper>
        </ThemeProvider>
    );
};

export default ReceiverAccountsListAdmin;