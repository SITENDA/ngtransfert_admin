import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, setItem } from '../../features/auth/authSlice';
import { Link } from 'react-router-dom';
import { selectSidebarCollapsed } from '../../features/auth/authSlice';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/js/dist/modal';
import { Menu, Button } from 'antd';
import UserProfile from '../form-controls/UserProfile';
import { selectIsDarkTheme } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useLogoutMutation } from '../../features/auth/authApiSlice';
import { initialState } from '../../util/initials';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import ToggleThemeButtonClient from './ToggleThemeButtonClient';
import { HomeOutlined, PhoneOutlined } from '@ant-design/icons'
import { adminPaths, publicPaths } from '../../util/frontend';
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

    async function handleLogout() {
        console.log("Logout function called")
        const response = await logout().unwrap();

        if (response.statusCode === 204) {
            localStorage.setItem("prevPath", "/topbar");

            // Create an array of promises for resetting state items
            const resetStatePromises = Object.entries(authState).map(([key, value]) =>
                dispatch(setItem({ key, value: initialState[key] }))
            );

            // Wait for all state items to be reset
            await Promise.all(resetStatePromises);

            navigate("/");
        }
    }


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
