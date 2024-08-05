import { Menu } from 'antd'
import { HomeOutlined, PayCircleOutlined, MoneyCollectOutlined, ManOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { adminPaths } from '../../util/frontend';
import { useState } from 'react';
import { MdOutlineRequestPage } from "react-icons/md";
import { GiTakeMyMoney } from "react-icons/gi";
import { FaCheck } from "react-icons/fa";
import { MdOutlinePaid } from "react-icons/md";
import { FaFaceSmile, FaCashRegister, FaCcAmazonPay, FaHandHoldingDollar } from "react-icons/fa6";
import { CiFaceSmile } from "react-icons/ci";


const MenuList = ({ isDarkTheme }) => {
    const [current, setCurrent] = useState('home');
    const onClick = (e) => {
        setCurrent(e.key);
    };
    //////////////

    /////////////
    const items = [
        {
            label: <Link to={adminPaths.homePath}>Dashboard</Link>,
            key: 'home',
            icon: <HomeOutlined />,
        },
        {
            label: 'Clients',
            key: 'clients',
            icon: <CiFaceSmile />,
            children: [
                {
                    type: 'clientsgroup',
                    key: 'clientitem1',
                    icon: <FaCashRegister />,
                    label: (
                        <Link to={adminPaths.registerPath}>New Client</Link>
                    ),
                },
                {
                    type: 'clientsgroup',
                    key: 'clientitem2',
                    icon: <FaFaceSmile />,
                    label: (
                        <Link to={adminPaths.ClientsListPath}>Clients List</Link>
                    ),
                }

            ],
        },
        {
            label: 'Loans',
            key: 'loans',
            icon: <PayCircleOutlined />,
            children: [
                {
                    type: 'loansgroup',
                    key: 'loanitem1',
                    icon: <FaHandHoldingDollar />,
                    label: (
                        <Link to={adminPaths.requestLoanPath}>New Loan</Link>
                    ),
                },
                {
                    type: 'loansgroup',
                    key: 'loanitem2',
                    icon: <MdOutlineRequestPage />,
                    label: (
                        <Link to={adminPaths.loanRequestsPath}>Loan Requests</Link>
                    ),
                },
                {
                    type: 'loansgroup',
                    key: 'loanitem3',
                    icon: <GiTakeMyMoney />,
                    label: (
                        <Link to={adminPaths.currentLoansListPath}>Current Loans</Link>
                    ),
                },
                {
                    type: 'loansgroup',
                    key: 'loanitem4',
                    icon: <FaCheck />,
                    label: (
                        <Link to={adminPaths.settledLoansListPath}>Settled Loans</Link>
                    ),
                },

            ],
        },
        {
            label: 'Payments',
            key: 'payments',
            icon: <PayCircleOutlined />,
            children: [
                {
                    type: 'paymentsgroup',
                    key: 'paymentitem1',
                    icon: <FaCcAmazonPay />,
                    label: (
                        <Link to={adminPaths.makePaymentPath}>New Payment</Link>
                    ),
                },
                {
                    type: 'paymentsgroup',
                    key: 'paymentitem2',
                    icon: <MdOutlinePaid />,
                    label: (
                        <Link to={adminPaths.paymentsListPath}>Recent payments</Link>
                    ),
                }
            ],
        }
    ];

    return (
        <Menu theme={isDarkTheme ? 'dark' : 'light'} onClick={onClick} selectedKeys={[current]} mode="inline" items={items} className='menu-bar' style={{ maxHeight: '70vh', overflowY: 'auto', overflowX: 'auto' }} />
    )
}


export default MenuList
