import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useRefreshMutation } from "../../features/auth/authApiSlice";
import { selectCurrentToken, selectCurrentUser, setItem } from "../../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [refresh, { isLoading: isRefreshLoading }] = useRefreshMutation();
    const dispatch = useDispatch()
    const token = useSelector(selectCurrentToken)
    const persist = true;

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                const result = await refresh();
                if (result?.data?.data?.user) {
                    dispatch(setItem({ key: 'user', value: result?.data?.data?.user }));
                }
                if (result?.data?.data?.token) {
                    dispatch(setItem({ key: 'token', value: result?.data?.data?.token }));
                }

            }
            catch (err) {
                console.error("Error caught in persist login : ", err);
            }
            finally {
                (isRefreshLoading || isMounted) && setIsLoading(false);
            }
        }

        // persist added here AFTER tutorial video
        // Avoids unwanted call to verifyRefreshToken
        !token && persist ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [])

    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <p>Loading...</p>
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin
