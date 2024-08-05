import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, setItem, selectIsDarkTheme, selectSidebarCollapsed } from '../features/auth/authSlice';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Box, createTheme, ThemeProvider } from '@mui/material';
import {
    Menu as MenuIcon,
    Brightness4 as Brightness4Icon,
    Brightness7 as Brightness7Icon,
    MenuOpen as MenuOpenIcon,
    Notifications as NotificationsIcon,
    AccountCircle as AccountCircleIcon,
    ExitToApp as ExitToAppIcon,
    Settings as SettingsIcon,
    List as ListIcon,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLogoutMutation } from '../features/auth/authApiSlice';
import { initialState } from '../util/initials';
import { adminPaths } from '../util/frontend';
import UserProfile from './form-controls/UserProfile';
import { darkColor, lightColor } from '../util/initials';
import Logo from './form-controls/Logo';

const Topbar = () => {
    const authState = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const collapsed = useSelector(selectSidebarCollapsed);
    const [logout] = useLogoutMutation();
    const navigate = useNavigate();
    const [alertAnchorEl, setAlertAnchorEl] = useState(null);
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const user = useSelector(selectCurrentUser);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleTheme = () => {
        dispatch(setItem({ key: 'isDarkTheme', value: !isDarkTheme }));
    };

    const toggleSidebar = () => {
        dispatch(setItem({ key: 'sidebarCollapsed', value: !collapsed }));
    };

    const handleLogout = async () => {
        const response = await logout().unwrap();

        if (response.statusCode === 204) {
            localStorage.setItem("prevPath", "/topbar");

            // Create an array of promises for resetting state items
            const resetStatePromises = Object.entries(authState).map(([key, value]) =>
                dispatch(setItem({ key, value: initialState[key] }))
            );

            // Wait for all state items to be reset
            await Promise.all(resetStatePromises);

            navigate(adminPaths.homePath, { replace: true, state: { prevPath: location.pathname } });
        }
    };

    const handleAlertMenu = (event) => {
        setAlertAnchorEl(event.currentTarget);
        setProfileAnchorEl(null);
    };

    const handleProfileMenu = (event) => {
        setProfileAnchorEl(event.currentTarget);
        setAlertAnchorEl(null);
    };

    const handleClose = () => {
        setAlertAnchorEl(null);
        setProfileAnchorEl(null);
    };

    const theme = createTheme({
        palette: {
            mode: isDarkTheme ? 'dark' : 'light',
            background: {
                paper: isDarkTheme ? darkColor : lightColor,
            },
            text: {
                primary: isDarkTheme ? lightColor : darkColor,
            },
        },
    });

    const alertItems = [
        {
            key: '1',
            label: (
                <MenuItem key="1">
                    <NotificationsIcon style={{ color: isDarkTheme ? lightColor : darkColor }} />
                    <Typography variant="body2" style={{ color: isDarkTheme ? lightColor : darkColor }}>A new monthly report is ready to download!</Typography>
                </MenuItem>
            ),
        },
        {
            key: '2',
            label: (
                <MenuItem key="2">
                    <NotificationsIcon style={{ color: isDarkTheme ? lightColor : darkColor }} />
                    <Typography variant="body2" style={{ color: isDarkTheme ? lightColor : darkColor }}>$290.29 has been deposited into your account!</Typography>
                </MenuItem>
            ),
        },
        {
            key: '3',
            label: (
                <MenuItem key="3">
                    <NotificationsIcon style={{ color: isDarkTheme ? lightColor : darkColor }} />
                    <Typography variant="body2" style={{ color: isDarkTheme ? lightColor : darkColor }}>We've noticed unusually high spending for your account.</Typography>
                </MenuItem>
            ),
        },
        {
            key: '4',
            label: (
                <MenuItem key="4">
                    <Typography variant="body2" align="center" style={{ color: isDarkTheme ? lightColor : darkColor }}>Show All Alerts</Typography>
                </MenuItem>
            ),
        }
    ];

    const userProfileItems = [
        {
            key: '1',
            label: (
                <MenuItem key="1">
                    <AccountCircleIcon style={{ color: isDarkTheme ? lightColor : darkColor }} />
                    <Typography variant="body2" style={{ color: isDarkTheme ? lightColor : darkColor }}>Profile</Typography>
                </MenuItem>
            ),
        },
        {
            key: '2',
            label: (
                <MenuItem key="2">
                    <SettingsIcon style={{ color: isDarkTheme ? lightColor : darkColor }} />
                    <Typography variant="body2" style={{ color: isDarkTheme ? lightColor : darkColor }}>Settings</Typography>
                </MenuItem>
            ),
        },
        {
            key: '3',
            label: (
                <MenuItem key="3">
                    <ListIcon style={{ color: isDarkTheme ? lightColor : darkColor }} />
                    <Typography variant="body2" style={{ color: isDarkTheme ? lightColor : darkColor }}>Activity Log</Typography>
                </MenuItem>
            ),
        },
        {
            key: '4',
            label: (
                <MenuItem key="4" onClick={handleLogout}>
                    <ExitToAppIcon style={{ color: isDarkTheme ? lightColor : darkColor }} />
                    <Typography variant="body2" style={{ color: isDarkTheme ? lightColor : darkColor }}>Logout</Typography>
                </MenuItem>
            ),
        }
    ];

    return (
        <ThemeProvider theme={theme}>
            <Box mb={2}>
                <AppBar
                    position="static"
                    style={{ backgroundColor: isDarkTheme ? 'inherit' : lightColor }}
                >
                    <Toolbar>
                        <IconButton edge="start" aria-label="menu" onClick={toggleSidebar}>
                            {collapsed ? (
                                isDarkTheme ? <MenuIcon style={{ color: lightColor }} /> : <MenuOpenIcon style={{ color: darkColor }} />
                            ) : (
                                isDarkTheme ? <MenuOpenIcon style={{ color: lightColor }} /> : <MenuIcon style={{ color: darkColor }} />
                            )}
                        </IconButton>
                        {screenWidth > 700 &&
                            <Box variant="h6" style={{ flexGrow: 1 }} sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                <Logo />
                            </Box>}
                        <Button onClick={toggleTheme}>
                            {isDarkTheme ? <Brightness7Icon style={{ color: lightColor }} /> : <Brightness4Icon style={{ color: darkColor }} />}
                        </Button>
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-controls="alert-menu"
                            aria-haspopup="true"
                            onClick={handleAlertMenu}
                        >
                            <NotificationsIcon style={{ color: isDarkTheme ? lightColor : darkColor }} />
                        </IconButton>
                        <Menu
                            id="alert-menu"
                            anchorEl={alertAnchorEl}
                            keepMounted
                            open={Boolean(alertAnchorEl)}
                            onClose={handleClose}
                            PaperProps={{
                                style: {
                                    backgroundColor: isDarkTheme ? darkColor : lightColor,
                                    color: isDarkTheme ? lightColor : darkColor,
                                },
                            }}
                        >
                            {alertItems.map((item) => item.label)}
                        </Menu>
                        {user ? (
                            <>
                                <IconButton color="inherit" onClick={handleProfileMenu} style={{ color: isDarkTheme ? 'inherit' : darkColor }}>
                                    <UserProfile />
                                </IconButton>
                                <Menu
                                    id="user-profile-menu"
                                    anchorEl={profileAnchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(profileAnchorEl)}
                                    onClose={handleClose}
                                    PaperProps={{
                                        style: {
                                            backgroundColor: isDarkTheme ? darkColor : lightColor,
                                            color: isDarkTheme ? lightColor : darkColor,
                                        },
                                    }}
                                >
                                    {userProfileItems.map((item) => item.label)}
                                </Menu>
                            </>
                        ) : (
                            <Button color="inherit" component={Link} to={adminPaths.loginPath} style={{ color: isDarkTheme ? 'inherit' : darkColor }}>
                                Sign in
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>
        </ThemeProvider>
    );
};

export default Topbar;
