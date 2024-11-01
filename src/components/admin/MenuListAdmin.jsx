import {Menu} from 'antd';
import {HomeOutlined, PayCircleOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import {sendingRecordLinks} from '../../util/constants';
import {adminPaths} from '../../util/frontend';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {selectIsDarkTheme, setItem} from '../../features/auth/authSlice';

const MenuListAdmin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const HandleLinkClicked = async (nextPagePath) => {
        if (window.innerWidth < 850) {
            await dispatch(setItem({key: 'sidebarCollapsed', value: true}));
        }
        navigate(nextPagePath);
    }
    const isDarkTheme = useSelector(selectIsDarkTheme);

    const items = [
        {
            label: <Link style={{textDecoration: 'none'}} onClick={() => HandleLinkClicked(adminPaths.homePath)}
                         to={adminPaths.homePath}>Dashboard</Link>,
            key: 'home',
            icon: <HomeOutlined/>,
        },
        {
            label: <Link style={{textDecoration: 'none'}}
                         onClick={() => HandleLinkClicked(adminPaths.receiverAccountsPath)}
                         to={adminPaths.receiverAccountsPath}>Receiver Accounts</Link>,
            key: 'receiver-accounts',
            icon: <PayCircleOutlined/>,
        },
        {
            label: 'Sending Records',
            key: 'sending-records',
            icon: <PayCircleOutlined/>,
            children: sendingRecordLinks.map((item, index) => (
                {
                    key: `${item.text}-${index}`,
                    icon: item.icon,
                    type: 'sending-records',
                    label: <Link style={{textDecoration: 'none'}} onClick={() => HandleLinkClicked(item.path)}
                                 to={item.path}>{item.text}</Link>,
                }
            )),
        }
    ];

    return (
        <Menu
            theme={isDarkTheme ? 'dark' : 'light'}
            mode='inline'
            className='menu-bar'
            style={{maxHeight: '70vh', overflowY: 'auto', overflowX: 'auto'}}
            defaultOpenKeys={['sending-records']} // This will make the Payment Accounts submenu open by default
            items={items}
        />

    );
};

export default MenuListAdmin;