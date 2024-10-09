import React from 'react';
import ReplayIcon from '@mui/icons-material/Replay';
import {Box, Typography, IconButton, Button} from '@mui/material';
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const ClickToUpload = ({ handleFileChange, imageUrl }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{cursor: 'pointer'}}
        >
            <input
                type="file"
                id="alipayQrCodeImage-upload"
                style={{ display: 'none' }} // Hide the actual input element
                onChange={(e) => handleFileChange(e)}
            />
            <label htmlFor="alipayQrCodeImage-upload" style={{ width: '100%', height: '100%' }}>
                <IconButton component="span" sx={{ flexDirection: 'column' }}>
                    {imageUrl ? (
                        <>
                            <ReplayIcon fontSize="small" style={{ marginBottom: '5px' }} />
                            <Typography variant="caption">Change Image</Typography>
                        </>
                    ) : (
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<PhotoCamera />}
                        >
                            Upload
                        </Button>
                    )}
                </IconButton>
            </label>
        </Box>
    );
};

export default ClickToUpload;