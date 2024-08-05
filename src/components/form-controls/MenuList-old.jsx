import { Menu } from 'antd'
import { HomeOutlined, PayCircleOutlined, MoneyCollectOutlined, ManOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import NavItem from './NavItem'
import { loanLinks, paymentLinks } from '../../util/constants';
import SubMenu from './SubMenu'
import { adminPaths } from '../../util/frontend';

const MenuList = ({ isDarkTheme }) => {
    return (
        <Menu theme={isDarkTheme ? 'dark' : 'light'} mode='inline' className='menu-bar' style={{ maxHeight: '70vh', overflowY: 'auto', overflowX: 'auto' }}>
            <Menu.Item key="home" icon={<HomeOutlined />}>
                <Link to={adminPaths.homePath}>Dashboard</Link>
            </Menu.Item>
            {/* Nav Item - Pages Collapse Menu */}
            <Menu.SubMenu key={"loans"} icon={<PayCircleOutlined />} title="Loans">
                {
                     loanLinks.map((item, index) => (
                        <Menu.Item key={`${item.text}-${index}`} icon={item.icon}>
                            <Link to={item.path}>{item.text}</Link>
                        </Menu.Item>
                    ))
                }
            </Menu.SubMenu> 
            {/* Nav Item - Payments Collapse Menu */}
            {/* <NavItem params={{ links: clientLinks, key: "clients", title: "Clients", icon: <ManOutlined /> }} /> */}

            <Menu.SubMenu key={"payments"} icon={<MoneyCollectOutlined />} title="Payments">
                {
                     paymentLinks.map((item, index) => (
                        <Menu.Item key={`${item.text}-${index}`} icon={item.icon}>
                            <Link to={item.path}>{item.text}</Link>
                        </Menu.Item>
                    ))
                }
            </Menu.SubMenu> 
        </Menu>
    )
}


export default MenuList