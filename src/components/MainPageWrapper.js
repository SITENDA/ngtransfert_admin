import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {setItem} from '../features/auth/authSlice';

const MainPageWrapper = ({children}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setItem({key: 'sidebarCollapsed', value: true}));
    }, [dispatch]);

    const handleMainPageWrapperClick = (event) => {
        // Check if the clicked element is a button, link, input, or interactive element
        const clickedElement = event.target;
        const isInteractiveElement =
            clickedElement.tagName === 'BUTTON' ||
            clickedElement.tagName === 'A' ||
            clickedElement.tagName === 'INPUT' ||
            clickedElement.tagName === 'TEXTAREA' ||
            clickedElement.tagName === 'SELECT' ||
            clickedElement.isContentEditable;

        // Collapse sidebar only if the click was on an empty space (not an interactive element)
        if (!isInteractiveElement) {
            dispatch(setItem({key: 'sidebarCollapsed', value: true}));
        }
    };

    return (
        <div onClick={handleMainPageWrapperClick}>
            {children}
        </div>
    );
};

export default MainPageWrapper;
