import React from 'react';
import {darkColor, lightColor} from "../../util/initials";
import ClickToUpload from "./ClickToUpload";
import {useSelector} from "react-redux";
import {selectIsDarkTheme} from "../../features/auth/authSlice";

function QrCodeImageInput({ qrCodeImage, handleFileChange }) {
    const isDarkTheme = useSelector(selectIsDarkTheme);
    return (
        <>
            <label htmlFor="qrCodeImage-upload" className="form-label"
                   style={{color: isDarkTheme ? lightColor : darkColor}}>
                QR Code Image
            </label>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
            }}>
                <label htmlFor="qrCodeImage-upload"
                       style={{cursor: 'pointer', display: 'block'}}>
                    {qrCodeImage?.url && (
                        <img src={qrCodeImage.url} alt="QR Code"
                             style={{width: '100px', height: '100px'}}/>
                    )}
                </label>
                <ClickToUpload handleFileChange={handleFileChange} imageUrl={qrCodeImage?.url}/>
            </div>
        </>
    );
}

export default QrCodeImageInput;