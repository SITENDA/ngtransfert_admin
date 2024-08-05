import {Outlet} from 'react-router-dom'
import ScrollToTopButton from '../ScrollToTopButton'
import LogoutModal from '../LogoutModal';
import FooterAdmin from "./FooterAdmin";
import {Layout} from 'antd'
import {useSelector} from 'react-redux'
import {selectIsDarkTheme, selectDarkColor, selectLightColor, selectCurrentUser} from '../../features/auth/authSlice'
import PageHeading from '../PageHeading';
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";

const {Content} = Layout;

const LayoutAdmin = () => {
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const darkColor = useSelector(selectDarkColor)
    const lightColor = useSelector(selectLightColor)
    const user = useSelector(selectCurrentUser)

    return (
        <Layout className='base-layout' theme={isDarkTheme ? 'dark' : 'light'} style={{
            maxHeight: '100vh',
            height: '100vh',
            overflowX: 'auto',
            boxSizing: 'border-box',
            background: isDarkTheme ? darkColor : lightColor
        }}>
            {(user?.fullName && !Boolean(user?.isNewClient)) && <Sidebar/>}
            <Layout theme={isDarkTheme ? 'dark' : 'light'}
                    style={{background: isDarkTheme ? darkColor : lightColor, maxHeight: '100vh', height: '100vh'}}>
                <Content theme='dark' style={{
                    margin: '24px 16px 0',
                    background: isDarkTheme ? darkColor : lightColor,
                    overflowY: 'auto'
                }}>
                    <Topbar/>
                    <PageHeading title="Dashboard"/>
                    <Outlet/>
                </Content>
                <FooterAdmin/>
            </Layout>
            <ScrollToTopButton/>
            <LogoutModal/>
        </Layout>
    )
}

export default LayoutAdmin
