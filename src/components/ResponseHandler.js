import {setObjectItem} from "../features/auth/authSlice";
import React from "react";

export const ResponseHandler = async (response, refs, dispatch) => {

    if (response?.statusCode === 401 && response?.message === "Bad credentials") {
        await dispatch(setObjectItem({
            key: 'eventProperties', innerKey: "errorMessage",
            value: <>Invalid user name or password<br/></>
        }));
        await dispatch(setObjectItem({key: 'eventProperties', innerKey: "isError", value: true}));
        refs.errorRef.current.focus();
    } else if (response?.statusCode === 404 && response?.message === "User with these credentials does not exist") {
        await dispatch(setObjectItem({
            key: 'eventProperties', innerKey: "errorMessage",
            value: <>A user with these credentials does not exist. <br/>
                Please try again or register for a new account in case it is your first time at Novic.</>
        }));
        await dispatch(setObjectItem({key: 'eventProperties', innerKey: "isError", value: true}));
        refs.errorRef.current.focus();
    } else if (response?.statusCode !== 200 && response?.message) {
        await dispatch(setObjectItem({
            key: 'eventProperties', innerKey: "errorMessage",
            value: <>{response.message}</>
        }));
        await dispatch(setObjectItem({key: 'eventProperties', innerKey: "isError", value: true}));
        refs.errorRef.current.focus();
    } else if (response?.details) {
        await dispatch(setObjectItem({
            key: 'eventProperties', innerKey: "errorMessage",
            value: response.details
        }));
        await dispatch(setObjectItem({key: 'eventProperties', innerKey: "isError", value: true}));
    } else {
        await dispatch(setObjectItem({
            key: 'eventProperties', innerKey: "errorMessage",
            value: "An unknown error occurred."
        }));
        await dispatch(setObjectItem({key: 'eventProperties', innerKey: "isError", value: true}));
    }
}
