import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWeixin, faAlipay } from '@fortawesome/free-brands-svg-icons';  // WeChat and Alipay icons
import { faUniversity } from '@fortawesome/free-solid-svg-icons';  // General Bank icon

const ReceiverAccountType = Object.freeze({
    ALIPAY_ACCOUNT: 'ALIPAY_ACCOUNT',
    WECHAT_ACCOUNT: 'WECHAT_ACCOUNT',
    BANK_ACCOUNT: 'BANK_ACCOUNT'
});

export default ReceiverAccountType;

export const orderedReceiverAccountTypes = [
    {
        label: "WeChat",
        value: ReceiverAccountType.WECHAT_ACCOUNT,
        icon: <FontAwesomeIcon icon={faWeixin} style={{ color: '#07C160' }} />  // Green color for WeChat
    },
    {
        label: "Alipay",
        value: ReceiverAccountType.ALIPAY_ACCOUNT,
        icon: <FontAwesomeIcon icon={faAlipay} style={{ color: '#1677FF' }} />  // Alipay Blue
    },
    {
        label: "Bank",
        value: ReceiverAccountType.BANK_ACCOUNT,
        icon: <FontAwesomeIcon icon={faUniversity} style={{ color: '#FF4500' }} />  // Red-orange for Bank
    }
];