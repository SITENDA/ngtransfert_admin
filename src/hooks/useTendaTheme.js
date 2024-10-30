// useTendaTheme.js
import { darkColor, lightColor } from "../util/initials";
import { useSelector } from "react-redux";
import { selectIsDarkTheme } from "../features/auth/authSlice";
import { createTheme } from "@mui/material";

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
        typography: {
            fontFamily: "Arial, Helvetica, sans-serif",
        },
        components: {
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        background: isDarkTheme ? darkColor : lightColor,
                        color: isDarkTheme ? lightColor : darkColor,
                    },
                },
            },
        },
    });
};
