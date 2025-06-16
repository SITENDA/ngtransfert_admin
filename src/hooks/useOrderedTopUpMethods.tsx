"use client"; // Ensures the hook runs on the client side

import { useTranslations } from 'next-intl';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import {DataObj} from "../../types/DataObj";

// TopUpMethod Enum
export enum TopUpMethodEnum {
    BANK = 'BANK',
    MOBILE_MONEY = 'MOBILE_MONEY',
    ORANGE_MONEY = 'ORANGE_MONEY',
    WAVE = 'WAVE',
    CASH = 'CASH'
}

// Hook that returns the ordered list of top-up methods with translation and icons
export const useOrderedTopUpMethods = (): DataObj[] => {
    const t = useTranslations('TopUpMethod'); // Translation namespace (adjust as needed)

    return [
        {
            label: t('mobileMoney'), // Example key: 'mobileMoney': 'MTN Mobile Money'
            value: TopUpMethodEnum.MOBILE_MONEY,
            icon: <MobileFriendlyIcon sx={{ color: '#FFA500' }} />
},
    {
        label: t('wave'), // Example key: 'wave': 'Wave'
            value: TopUpMethodEnum.WAVE,
        icon: <MonetizationOnIcon sx={{ color: '#1E90FF' }} />
    },
    {
        label: t('orangeMoney'), // Example key: 'orangeMoney': 'Orange Money'
            value: TopUpMethodEnum.ORANGE_MONEY,
        icon: <LocalAtmIcon sx={{ color: '#FF4500' }} />
    },
    {
        label: t('cash'), // Example key: 'cash': 'Cash'
            value: TopUpMethodEnum.CASH,
        icon: <AttachMoneyIcon sx={{ color: '#4CAF50' }} />
    },
    {
        label: t('bank'), // Example key: 'bank': 'Bank'
            value: TopUpMethodEnum.BANK,
        icon: <AccountBalanceIcon sx={{ color: '#008000' }} />
    }
];
};
