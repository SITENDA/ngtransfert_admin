import React from 'react';
import {Button} from 'antd';
import {useSelector} from 'react-redux';
import {selectIsDarkTheme} from '../../features/auth/authSlice';
import {darkColor, lightColor} from "../../util/initials";

const TableButton = ({onClick, label}) => {
    const isDarkTheme = useSelector(selectIsDarkTheme);
    const bgColorLight = 'rgba(0,21,41,0.2)';
    const bgColorDark = '#1c011c';

    return (
        <Button
            type='dashed'
            style={{
                background: isDarkTheme? bgColorDark : bgColorLight,
                // background: isDarkTheme ? darkColor : lightColor,
                color: isDarkTheme ? lightColor : darkColor,

            }}
            onClick={onClick}
        >
            {label}
        </Button>
    );
};

export default TableButton;