import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setItem } from '../features/auth/authSlice';

const MainPageWrapper = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setItem({ key: 'sidebarCollapsed', value: true }));
    }, [dispatch]);

    const handleMainPageWrapperClick = (event) => {
        // Check if the click event is within a form or a submit button
        const isFormElement = event.target.closest('form');
        const isSubmitButton = event.target.type === 'submit';

        if (!isFormElement && !isSubmitButton) {
            event.preventDefault();
            dispatch(setItem({ key: 'sidebarCollapsed', value: true }));
        }
    };

    return (
        <div onClick={handleMainPageWrapperClick}>
            {children}
        </div>
    );
};

export default MainPageWrapper;
