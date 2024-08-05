import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, Outlet, Navigate } from 'react-router-dom';
import { selectCurrentUser } from '../features/auth/authSlice'; // Ensure this path is correct
import {publicPaths} from "../util/frontend";

const RequireAuth = ({ allowedRoles }) => {
    const currentUser = useSelector(selectCurrentUser); // Retrieve the current user from the Redux state
    const location = useLocation();
    const hasRole = currentUser?.roles?.find(role => allowedRoles?.includes(role.roleName));

    return (
        currentUser && hasRole
            ? <Outlet /> // Proceed to the requested route if the user has the required role
            : <Navigate to={publicPaths.loginPath} state={{ from: location }} replace /> // Redirect to login if the user is not authenticated
    );
};

export default RequireAuth;