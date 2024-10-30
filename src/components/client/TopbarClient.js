import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, setItem } from '../../features/auth/authSlice';
import { Link } from 'react-router-dom';
import { selectSidebarCollapsed } from '../../features/auth/authSlice';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/js/dist/modal';
import { Menu, Button } from 'antd';
import { selectIsDarkTheme } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useLogoutMutation } from '../../features/auth/authApiSlice';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import ToggleThemeButtonClient from './ToggleThemeButtonClient';
import { publicPaths } from '../../util/frontend';
import { useEffect, useState } from 'react';

const TopbarClient = () => {
    const user = useSelector(selectCurrentUser);
    const [hasUser, setHasUser] = useState(Boolean(user?.fullName))
    const authState = useSelector(state => state.auth)
    const fullName = user?.fullName ? user.fullName.split(" ")[1] : '';
    const collapsed = useSelector(selectSidebarCollapsed)
    const dispatch = useDispatch()
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const [logout, { isLoading }] = useLogoutMutation();
    const navigate = useNavigate();
    const toggleTheme = () => {
        dispatch(setItem({ key: 'isDarkTheme', value: !isDarkTheme }));
    };

    useEffect(() => {
        setHasUser(Boolean(user?.fullName))
    }, [user, hasUser, navigate])

    const toggleSidebar =() => {
        dispatch(setItem({ key: 'sidebarCollapsed', value: !collapsed }))

    }

    const handleLogout = async () => {
        const response = await logout().unwrap();
        if (response.statusCode === 204) {
            dispatch(setItem({ key: 'token', value: '' }));
            dispatch(setItem({ key: 'user', value: '' }));
        }
    };


    const items = [
        hasUser && { key: "topbar", label: <Button style={{ background: "white", }} type='text' className='toggle' onClick={toggleSidebar} icon={collapsed ?
            <MenuUnfoldOutlined /> :
            <MenuFoldOutlined />} />},
        !hasUser && { key: "signin", label: <Link to={publicPaths.loginPath}>{hasUser && "Sign out"} {!hasUser && "Sign in"}</Link> },
        hasUser && { key: "signout", label: <HashLink className="nav-link" onClick={handleLogout}>Sign out</HashLink>},
        { key: "toggleTheme", label: <ToggleThemeButtonClient darkTheme={isDarkTheme} toggleTheme={toggleTheme} /> },
    ]

    return (
        <Menu
            theme={isDarkTheme ? "dark" : 'light'}
            mode="horizontal"
            defaultSelectedKeys={['2']}
            items={items} // Reverse the order of items to start from the right
            style={{
                flex: 1,
                width: '100%',
                maxWidth: '100%',
                display: "flex",
                alignItems: "center",
                justifyContent: 'center',
                borderBottom: "1px solid #888",
                marginBottom: '20px'
            }}
        />
    );

}

export default TopbarClient
