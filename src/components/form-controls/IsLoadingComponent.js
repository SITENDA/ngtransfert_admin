import React from 'react'
import { useSelector } from 'react-redux'
import { selectIsDarkTheme } from '../../features/auth/authSlice'
import { darkColor, lightColor } from '../../util/initials'

const IsLoadingComponent = () => {
  const isDarkTheme = useSelector(selectIsDarkTheme)
  return (
    <p style={{ color: `${isDarkTheme ? lightColor : darkColor}`}}>Loading...</p>
  )
}

export default IsLoadingComponent