import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AnimatedRoutes from './components/AnimatedRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setItem } from './features/auth/authSlice';

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth > 768) {
                dispatch(setItem({ key: "sidebarCollapsed", value: false }));
            } else {
                dispatch(setItem({ key: "sidebarCollapsed", value: true }));
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [dispatch]);
    return (
        <ErrorBoundary fallback="Error">
            <Router>
                <AnimatedRoutes />
            </Router>
        </ErrorBoundary>
    );
}

export default App;
