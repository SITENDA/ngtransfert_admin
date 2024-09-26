//useTendaTheme.js
import {darkColor, lightColor} from "../util/initials";
import {useSelector} from "react-redux";
import {selectIsDarkTheme} from "../features/auth/authSlice";
import {createTheme} from "@mui/material";

// Custom hook for theme creation
export const useTendaTheme = () => {
    const isDarkTheme = useSelector(selectIsDarkTheme);

    return createTheme({
        palette: {
            mode: isDarkTheme ? 'dark' : 'light',
            background: {
                paper: isDarkTheme ? darkColor : lightColor,
            },
            text: {
                primary: isDarkTheme ? lightColor : darkColor,
            },
        },
        components: {
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        background: {
                            paper: isDarkTheme ? darkColor : lightColor,
                        },
                        text: {
                            primary: isDarkTheme ? lightColor : darkColor,
                        },
                    },
                },
            },
        },
    });
};
