"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWeixin, faAlipay } from '@fortawesome/free-brands-svg-icons';  // WeChat and Alipay icons
import { faUniversity } from '@fortawesome/free-solid-svg-icons';
import {ReceiverAccountCategoryEnum} from "@/zod-schemas/receiver-account";
import {ReactNode} from "react";  // General Bank icon

type DataObj = {
    label: string;
    value: string;
    icon?: ReactNode;
};

export const orderedReceiverAccountTypes: DataObj[] = [
    {
        label: "WeChat",
        value: ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT, // Use the Zod enum value
        icon: <FontAwesomeIcon icon={faWeixin} style={{ color: '#07C160' }} />
    },
    {
        label: "Alipay",
        value: ReceiverAccountCategoryEnum.enum.ALIPAY_ACCOUNT, // Use the Zod enum value
        icon: <FontAwesomeIcon icon={faAlipay} style={{ color: '#1677FF' }} />
    },
    {
        label: "Bank",
        value: ReceiverAccountCategoryEnum.enum.BANK_ACCOUNT, // Use the Zod enum value
        icon: <FontAwesomeIcon icon={faUniversity} style={{ color: '#FF4500' }} />
    }
];