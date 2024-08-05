import React from 'react'
import { Layout } from 'antd'
import { useSelector } from 'react-redux';
import { selectDarkColor, selectIsDarkTheme, selectLightColor } from '../../features/auth/authSlice'
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';

const { Footer } = Layout;

const FooterAdmin = ({ transparent }) => {
    const isDarkTheme = useSelector(selectIsDarkTheme)
    const darkColor = useSelector(selectDarkColor)
    const lightColor = useSelector(selectLightColor)

    const footerStyle = {
        padding: 0,
        // position: 'sticky',
        bottom: 0,
        zIndex: 1,
        width: '100%',
        maxHeight: '10%',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: '3%',
        background: transparent ? 'transparent' : isDarkTheme ? darkColor : lightColor
    }
    return (
        <Footer theme={isDarkTheme ? 'dark' : 'light'} className="sticky-footer" style={footerStyle}>
            <div className="container my-auto">
                <div className="copyright text-center my-auto">
                    <div className= {isDarkTheme ? "text-white" : "text-muted"}>
                        <div className="small text-center mb-3 pb-2" style={{ marginBottom: '0.5rem' }}>Copyright &copy; 2023 - Novic Financial Services</div>
                    </div>
                </div>
            </div>
        </Footer>
    )
}

export default FooterAdmin