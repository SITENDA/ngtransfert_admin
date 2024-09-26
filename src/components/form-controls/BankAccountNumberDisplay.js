import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useSelector } from "react-redux";
import { selectIsDarkTheme } from "../../features/auth/authSlice";
import { darkColor, lightColor } from "../../util/initials";

const BankAccountNumberDisplay = ({ bankAccountNumber }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const isDarkTheme = useSelector(selectIsDarkTheme);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <span style={{ cursor: 'pointer', textDecoration: 'underline', fontSize: '1rem', color: isDarkTheme ? lightColor : darkColor }} onClick={showModal}>
                {bankAccountNumber}
            </span>
            <Dialog
                open={isModalVisible}
                onClose={handleCancel}
                aria-labelledby="bank-account-name-dialog-title"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle id="bank-account-name-dialog-title">Bank Account Number</DialogTitle>
                <DialogContent>
                    <span style={{ fontSize: '1.5em' }}>{bankAccountNumber}</span>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default BankAccountNumberDisplay;