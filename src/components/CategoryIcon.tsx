"use client";

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlipay, faWeixin } from '@fortawesome/free-brands-svg-icons';
import { faUniversity } from '@fortawesome/free-solid-svg-icons';

interface Props {
    category: string;
}

const CategoryIcon: React.FC<Props> = ({ category }) => {
    const size = '1.5em';
    switch (category) {
        case 'ALIPAY_ACCOUNT':
            return <FontAwesomeIcon icon={faAlipay} style={{ color: '#1677FF', fontSize: size }} />;
        case 'WECHAT_ACCOUNT':
            return <FontAwesomeIcon icon={faWeixin} style={{ color: '#07C160', fontSize: size }} />;
        case 'BANK_ACCOUNT':
            return <FontAwesomeIcon icon={faUniversity} style={{ color: '#FF4500', fontSize: size }} />;
        default:
            return null;
    }
};

export default CategoryIcon;
