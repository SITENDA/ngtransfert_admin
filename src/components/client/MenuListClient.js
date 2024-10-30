import {Menu} from 'antd';
import {HomeOutlined, PayCircleOutlined} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import {receiverAccountLinks, sendingRecordLinks} from '../../util/constants';
import {adminPaths} from '../../util/frontend';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {setItem} from '../../features/auth/authSlice';
import {selectSidebarCollapsed} from "../../features/auth/authSlice";

const MenuListClient = ({isDarkTheme}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const collapsed = useSelector(selectSidebarCollapsed);
    const HandleLinkClicked = async (nextPagePath) => {
        if (window.innerWidth < 850) {
            await dispatch(setItem({key: 'sidebarCollapsed', value: true}));
        }
        navigate(nextPagePath);
    }

    return (
        <Menu
            theme={isDarkTheme ? 'dark' : 'light'}
            mode='inline'
            className='menu-bar'
            style={{maxHeight: '70vh', overflowY: 'auto', overflowX: 'auto'}}
            defaultOpenKeys={['loans']} // This will make the Payment Accounts submenu open by default
        >
            {!collapsed && <>
                <Menu.Item key="home" icon={<HomeOutlined/>}>
                    <Link onClick={() => HandleLinkClicked(adminPaths.homePath)}
                          to={adminPaths.homePath}>Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="receiver-accounts" icon={<PayCircleOutlined/>}>
                    <Link onClick={() => HandleLinkClicked(adminPaths.receiverAccountsPath)}
                          to={adminPaths.receiverAccountsPath}>Receiver Accounts</Link>
                </Menu.Item>
                <Menu.SubMenu key="sending-records" icon={<PayCircleOutlined/>} title="Sending Records">
                    {sendingRecordLinks.map((item, index) => (
                        <Menu.Item key={`${item.text}-${index}`} icon={item.icon}>
                            <Link onClick={() => HandleLinkClicked(item.path)} to={item.path}>{item.text}</Link>
                        </Menu.Item>
                    ))}
                </Menu.SubMenu>
            </>}
        </Menu>
    );
};

export default MenuListClient;
