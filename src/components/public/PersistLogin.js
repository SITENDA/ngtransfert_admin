import {useEffect, useState} from 'react';
import {useRefreshMutation} from "../../features/auth/authApiSlice";
import {selectCurrentToken, selectCurrentUser} from "../../features/auth/authSlice";
import {useSelector} from "react-redux";
import {Outlet} from "react-router-dom";
import {CircularProgress, Box} from '@mui/material';

function PersistLogin() {
    const [isLoading, setIsLoading] = useState(true);
    const [refresh] = useRefreshMutation();
    const user = useSelector(selectCurrentUser);
    const accessToken = useSelector(selectCurrentToken)

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false)
            }
        }

        !(accessToken?.length > 10 || user?.fullName) ? verifyRefreshToken() : setIsLoading(false);
    }, [])
    return (
        <>
            {isLoading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <CircularProgress/>
                </Box>
            ) : (
                <Outlet/>
            )}
        </>
    );
}

export default PersistLogin;