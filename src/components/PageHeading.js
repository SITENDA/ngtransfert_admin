import React from 'react'
import {selectCurrentTitle, selectIsDarkTheme, selectSidebarCollapsed, setItem} from '../features/auth/authSlice';
import {useDispatch, useSelector} from 'react-redux';

const PageHeading = () => {
    const dispatch = useDispatch();
    const sidebarCollapsed = useSelector(selectSidebarCollapsed);
    const handleMainWindowClick = async () => {
        if (!sidebarCollapsed) {
            dispatch(setItem({key: 'sidebarCollapsed', value: true}));
        }
    }

    const title = useSelector(selectCurrentTitle);
    const isDarkTheme = useSelector(selectIsDarkTheme)
    const colorClass = isDarkTheme ? "text-white" : "text-black";
    return (
        <section id="register" className="container" style={{height: '10%'}} onClick={handleMainWindowClick}>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className={`d-sm-flex align-items-center ${colorClass}`}>
                        <h1 className={`h3 ${colorClass}`}> {title}</h1>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PageHeading
