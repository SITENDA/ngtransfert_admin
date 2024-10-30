import React from 'react';
import {useSelector} from 'react-redux';
import {useLocation, Navigate, Outlet} from 'react-router-dom';
import {selectCurrentUser} from '../features/auth/authSlice'; // Ensure this path is correct
import { publicPaths } from '../util/frontend';

const RequireAuth = ({allowedRoles}) => {
    const user = useSelector(selectCurrentUser); // Retrieve the current user from the Redux state
    const location = useLocation();
    const hasRole = user?.roles?.find(role => allowedRoles?.includes(role.roleName));

    return (
        <>
            {
                hasRole
                    ? <Outlet/>
                    : <Navigate to={publicPaths.loginPath} state={{from: location}} replace/>
            }
        </>
    )
};

export default RequireAuth;
