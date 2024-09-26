import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import {useSelector} from "react-redux";
import {selectIsDarkTheme} from "../../features/auth/authSlice";
import {darkColor, lightColor} from "../../util/initials";

const EmailDisplay = ({ email }) => {
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
            <span style={{ cursor: 'pointer', textDecoration: 'underline', fontSize : '1rem', color: isDarkTheme ? lightColor : darkColor }} onClick={showModal}>
                {email}
            </span>
            <Dialog
                open={isModalVisible}
                onClose={handleCancel}
                aria-labelledby="email-dialog-title"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle id="email-dialog-title">Email</DialogTitle>
                <DialogContent>
                    <span style={{ fontSize: '1.5em' }}>{email}</span>
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

export default EmailDisplay;