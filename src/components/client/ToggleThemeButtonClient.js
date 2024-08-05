import React from 'react'
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi'
import { Button } from 'antd'

const ToggleThemeButtonClient = ({ isDarkTheme, toggleTheme }) => {
    return (
        <div className='toggle-theme-btn-client'>
            <Button onClick={toggleTheme}>
                {
                    isDarkTheme ? <HiOutlineSun />
                        : <HiOutlineMoon />
                }
            </Button>
        </div>
    )
}

export default ToggleThemeButtonClient