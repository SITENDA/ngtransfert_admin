import React, {useState} from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material';
import {backend} from "../../util/backend";

const ImageDisplay = ({imageUrl, title}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const urlToUse = imageUrl?.startsWith("http") ? imageUrl : backend.imagesUrl + imageUrl;

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            {urlToUse ? (
                <>
                    <img
                        src={urlToUse}
                        alt={title}
                        style={{width: 50, height: 50, cursor: 'pointer'}}
                        onClick={showModal}
                    />
                    <Dialog
                        open={isModalVisible}
                        onClose={handleCancel}
                        aria-labelledby="dialog-title"
                        maxWidth="md"
                        fullWidth
                    >
                        <DialogTitle id="dialog-title">{title}</DialogTitle>
                        <DialogContent>
                            <img
                                src={urlToUse}
                                alt={title}
                                style={{width: '100%'}}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCancel} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            ) : (
                <p>No image available</p>
            )}
        </div>
    );
};

export default ImageDisplay;
