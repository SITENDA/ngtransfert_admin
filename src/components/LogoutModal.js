import React from 'react';
import { Modal, Button } from 'antd';

const LogoutModal = ({ visible, onCancel, onLogout }) => {
  return (
    <Modal
      title="Ready to Leave?"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="logout" type="primary" onClick={onLogout}>
          Logout
        </Button>,
      ]}
    >
      <p>Select "Logout" below if you are ready to end your current session.</p>
    </Modal>
  );
};

export default LogoutModal;
