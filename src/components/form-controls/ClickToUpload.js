import React from 'react';
import { useSelector } from "react-redux";
import { selectIsDarkTheme } from "../../features/auth/authSlice";
import { darkColor, lightColor } from "../../util/initials";
import ReplayIcon from '@mui/icons-material/Replay'; // Import a reload icon

const ClickToUpload = ({ handleFileChange, imageUrl }) => {
    const isDarkTheme = useSelector(selectIsDarkTheme);

    return (
        <div>
            <input
                type="file"
                id="alipayQrCodeImage-upload"
                style={{
                    display: 'none', // Hide the actual input element
                }}
                onChange={(e) => handleFileChange(e)}
            />
            <label
                htmlFor="alipayQrCodeImage-upload"
                style={{
                    width: '100px',
                    height: '100px',
                    border: '1px dashed #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: isDarkTheme ? lightColor : darkColor,
                    cursor: 'pointer',
                    flexDirection: 'column', // Center text and icon vertically
                }}
            >
                {imageUrl ? (
                    <>
                        <ReplayIcon fontSize="small" style={{ marginBottom: '5px' }} /> {/* Reload icon */}
                        <span>Change Image</span>
                    </>
                ) : (
                    <span>Click to Upload</span>
                )}
            </label>
        </div>
    );
};

export default ClickToUpload;
