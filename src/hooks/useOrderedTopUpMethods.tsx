"use client"; // Ensures the hook runs on the client side

import { useTranslations } from 'next-intl';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import {DataObj} from "../../types/DataObj";
import {TopUpMethodEnum} from "@/enums/TopUpMethodEnum";

// Hook that returns the ordered list of details methods with translation and icons
export const useOrderedTopUpMethods = (): DataObj[] => {
    const t = useTranslations('TopUpMethod'); // Translation namespace (adjust as needed)

    return [
        {
            label: t('MOBILE_MONEY'),
            value: TopUpMethodEnum.MOBILE_MONEY,
            icon: <MobileFriendlyIcon sx={{ color: '#FFA500' }} />
        },
        {
            label: t('WAVE'),
            value: TopUpMethodEnum.WAVE,
            icon: <MonetizationOnIcon sx={{ color: '#1E90FF' }} />
        },
        {
            label: t('ORANGE_MONEY'),
            value: TopUpMethodEnum.ORANGE_MONEY,
            icon: <LocalAtmIcon sx={{ color: '#FF4500' }} />
        },
        {
            label: t('CASH'),
            value: TopUpMethodEnum.CASH,
            icon: <AttachMoneyIcon sx={{ color: '#4CAF50' }} />
        },
        {
            label: t('BANK'),
            value: TopUpMethodEnum.BANK,
            icon: <AccountBalanceIcon sx={{ color: '#008000' }} />
        }
];
};
