import React from 'react'
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi'
import { Button } from 'antd'

const ToggleThemeButton = ({ isDarkTheme, toggleTheme }) => {
    return (
        <div className='toggle-theme-btn'>
            <Button onClick={toggleTheme}>
                {
                    isDarkTheme ? <HiOutlineSun />
                        : <HiOutlineMoon />
                }
            </Button>
        </div>
    )
}

export default ToggleThemeButton