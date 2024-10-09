import React from 'react';
import { darkColor, lightColor } from "../../util/initials";
import { useSelector } from "react-redux";
import { selectIsDarkTheme } from "../../features/auth/authSlice";
import { Typography, Box, Button, IconButton } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const UploadButton = ({ hasImage, handleImageChange, labelId }) => {
    const isDarkTheme = useSelector(selectIsDarkTheme);

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <input
                type="file"
                id={labelId}
                style={{ display: 'none' }}
                onChange={(e) => handleImageChange(e)}
            />
            <label htmlFor={labelId} style={{ width: '100%', height: '100%', cursor: 'pointer' }}>
                <IconButton component="span" sx={{ flexDirection: 'column' }}>
                    {hasImage ? (
                        <>
                            <ReplayIcon fontSize="small" style={{ marginBottom: '5px' }} />
                            <Typography variant="caption" style={{ color: isDarkTheme ? lightColor : darkColor }}>
                                Change Image
                            </Typography>
                        </>
                    ) : (
                        <Button
                            variant="outlined"
                            component="span"
                            startIcon={<PhotoCamera />}
                            type="button"  // Ensures the button type is "button"
                        >
                            Upload
                        </Button>
                    )}
                </IconButton>
            </label>
        </Box>
    );
};

function ImageInput({ image, handleImageChange, label }) {
    const isDarkTheme = useSelector(selectIsDarkTheme);

    return (
        <>
            <Typography
                variant="subtitle1"
                component="label"
                htmlFor="image-upload"
                style={{ color: isDarkTheme ? lightColor : darkColor, marginBottom: '10px' }}
            >
                {label}
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
                {image?.url && (
                    <Box component="label" htmlFor="image-upload" sx={{ display: 'block', cursor: 'pointer' }}>
                        <img src={image.url} alt={label} style={{ width: '100px', height: '100px' }} />
                    </Box>
                )}
                <UploadButton
                    hasImage={!!image?.url}
                    handleImageChange={handleImageChange}
                    labelId="image-upload"
                />
            </Box>
        </>
    );
}

export default ImageInput;