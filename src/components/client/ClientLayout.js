import {Outlet} from 'react-router-dom'
import ScrollToTopButton from '../ScrollToTopButton'
import LogoutModal from '../LogoutModal';
import '../../assets/css/Nunito.css';
import '../../assets/css/fontawesome-free/css/all.min.css';
import '../../assets/css/sb-admin-2.min.css';
import '../../assets/css/antd-new.css';
import {Layout} from 'antd'
import {useSelector} from 'react-redux'
import {selectIsDarkTheme, selectDarkColor, selectLightColor} from '../../features/auth/authSlice'
import SidebarClient from './SidebarClient'
import TopbarClient from './TopbarClient'
import {selectCurrentUser} from '../../features/auth/authSlice';
import FooterAdmin from "../admin/FooterAdmin";

const {Content} = Layout;

const ClientLayout = () => {
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const darkColor = useSelector(selectDarkColor);
    const lightColor = useSelector(selectLightColor);
    const user = useSelector(selectCurrentUser)

    return (
        <Layout
            className='base-layout' theme={isDarkTheme ? 'dark' : 'light'}
            style={{
                maxHeight: '100vh',
                height: '100vh',
                overflowX: 'auto',
                boxSizing: 'border-box',
                background: isDarkTheme ? darkColor : lightColor
            }}>
            {user?.fullName && <SidebarClient/>}
            <Layout theme={isDarkTheme ? 'dark' : 'light'}
                    style={{background: isDarkTheme ? darkColor : lightColor, maxHeight: '100vh', height: '100vh'}}>
                <Content theme='dark' style={{
                    margin: '24px 16px 0',
                    background: isDarkTheme ? darkColor : lightColor,
                    overflowY: 'auto'
                }}>
                    <TopbarClient/>
                    <Outlet/>
                </Content>
                <FooterAdmin/>
            </Layout>
            <ScrollToTopButton/>
            <LogoutModal/>
        </Layout>
    )
}

export default ClientLayout