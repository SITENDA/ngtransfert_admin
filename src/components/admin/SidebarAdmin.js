import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSidebarCollapsed, selectIsDarkTheme, setItem } from '../../features/auth/authSlice';
import { Drawer, Box, IconButton, Button, Typography } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import Logo from '../form-controls/Logo';
import MenuList from './MenuListAdmin';
import ToggleThemeButton from '../form-controls/ToggleThemeButton';
import { darkColor, lightColor } from '../../util/initials';

const SidebarAdmin = () => {
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const collapsed = useSelector(selectSidebarCollapsed);
    const dispatch = useDispatch();

    const toggleTheme = () => {
        dispatch(setItem({ key: 'isDarkTheme', value: !isDarkTheme }));
    };

    const toggleSidebar = () => {
        dispatch(setItem({ key: 'sidebarCollapsed', value: !collapsed }));
    };

    return (
        <>
            <Drawer
                variant="persistent"
                anchor="left"
                open={!collapsed}
                PaperProps={{
                    style: {
                        backgroundColor: isDarkTheme ? darkColor : lightColor,
                        color: isDarkTheme ? lightColor : darkColor,
                        width: collapsed ? 0 : 250,
                        transition: 'width 0.3s',
                        overflowX: 'hidden',
                    }
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" p={1}>
                    <Logo />
                    <IconButton onClick={toggleSidebar}>
                        {collapsed ? <ChevronRightIcon style={{ color: isDarkTheme ? lightColor : darkColor }} /> : <ChevronLeftIcon style={{ color: isDarkTheme ? lightColor : darkColor }} />}
                    </IconButton>
                </Box>
                <MenuList isDarkTheme={isDarkTheme} />
            </Drawer>
            <Box position="fixed" bottom={16} left={16}>
                <ToggleThemeButton darkTheme={isDarkTheme} toggleTheme={toggleTheme} />
            </Box>
        </>
    );
};

export default SidebarAdmin;
