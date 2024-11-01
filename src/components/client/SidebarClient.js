import { selectSidebarCollapsed, selectIsDarkTheme } from '../../features/auth/authSlice';
import { useSelector } from 'react-redux';
import { Layout } from 'antd';
import Logo from '../form-controls/Logo';
import MenuListAdmin from "../admin/MenuListAdmin";

const { Sider } = Layout;

const SidebarClient = () => {
    const isDarkTheme = useSelector(selectIsDarkTheme)
    const collapsed = useSelector(selectSidebarCollapsed)

    return (
        <>
            <Sider
                collapsed={collapsed}
                collapsible
                collapsedWidth={collapsed ? 0 : 80}
                width={300}
                trigger={null}
                theme={isDarkTheme ? 'dark' : 'light'}
                className='sidebar'
                id='my-sider-client'
            >
                <div className="logo-container">
                    <Logo />
                </div>
                <MenuListAdmin/>
            </Sider>
            </>
    );
}

export default SidebarClient
