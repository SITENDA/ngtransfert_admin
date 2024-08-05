import { Menu } from 'antd'
import { HomeOutlined, PayCircleOutlined, MoneyCollectOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { loanLinks, paymentLinks } from '../../util/constants';

const MenuListClient = ({ isDarkTheme }) => {
    return (
        <Menu theme={isDarkTheme ? 'dark' : 'light'} mode='inline' className='menu-bar' style={{ maxHeight: '70vh', overflowY: 'auto', overflowX: 'auto' }}>
            <Menu.Item key="home" icon={<HomeOutlined />}>
                <Link >Dashboard</Link>
            </Menu.Item>
            <Menu.SubMenu key={"loans"} icon={<PayCircleOutlined />} title="Loans">
                {
                     loanLinks.map((item, index) => (
                        <Menu.Item key={`${item.text}-${index}`} icon={item.icon}>
                            <Link to={item.path}>{item.text}</Link>
                        </Menu.Item>
                    ))
                }
            </Menu.SubMenu> 

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


export default MenuListClient