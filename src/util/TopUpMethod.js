import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly'; // For Mobile Money
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'; // For Bank
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'; // For Wave
import LocalAtmIcon from '@mui/icons-material/LocalAtm'; // For Orange Money
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // For Cash

const TopUpMethod = Object.freeze({
    BANK: 'BANK',
    MOBILE_MONEY: 'MOBILE_MONEY',
    ORANGE_MONEY: 'ORANGE_MONEY',
    WAVE: 'WAVE',
    CASH: 'CASH'
});

export default TopUpMethod;

export const orderedTopUpMethods = [
    {
        label: "MTN Mobile Money",
        value: TopUpMethod.MOBILE_MONEY,
        icon: <MobileFriendlyIcon sx={{ color: '#FFA500' }} />  // Orange color for Mobile Money
    },
    {
        label: "Wave",
        value: TopUpMethod.WAVE,
        icon: <MonetizationOnIcon sx={{ color: '#1E90FF' }} />  // Light blue for Wave
    },
    {
        label: "Orange Money",
        value: TopUpMethod.ORANGE_MONEY,
        icon: <LocalAtmIcon sx={{ color: '#FF4500' }} />  // Red-orange color for Orange Money
    },
    {
        label: "Cash",
        value: TopUpMethod.CASH,
        icon: <AttachMoneyIcon sx={{ color: '#4CAF50' }} />  // Green color for Cash
    },
    {
        label: "Bank",
        value: TopUpMethod.BANK,
        icon: <AccountBalanceIcon sx={{ color: '#008000' }} />  // Dark green color for Bank
    }
];