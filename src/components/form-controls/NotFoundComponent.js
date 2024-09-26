import React from 'react'
import { selectIsDarkTheme } from '../../features/auth/authSlice'
import { useSelector } from 'react-redux'
import { darkColor, lightColor } from '../../util/initials'

const NotFoundComponent = ({ item, availableOrFound }) => {
    const isDarkTheme = useSelector(selectIsDarkTheme)
    return (
        <div className="text-center mt-5">
            <p  style={{ color: `${isDarkTheme ? lightColor : darkColor}`}} >{item ? item : "Item"} not {availableOrFound ? availableOrFound : "found"}!</p>
        </div>
    )
}

export default NotFoundComponent