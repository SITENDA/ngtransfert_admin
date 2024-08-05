import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {setItem} from '../../features/auth/authSlice';
import WelcomeText from '../WelcomeText';
import {useContactMutation} from '../../features/auth/authApiSlice';
import {setObjectItem} from '../../features/auth/authSlice';
import {useRef} from 'react';
import ErrorMessageComponent from '../form-controls/ErrorMessageComponent';
import {publicPaths} from '../../util/frontend';
import {useNavigate} from 'react-router-dom';

const Contact = () => {
    // State for form submission feedback messages
    const [, setSubmitSuccess] = useState(false);
    const [, setSubmitError] = useState(false);
    const [contact, {isSuccess}] = useContactMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const refs = {
        emailRef: useRef(null),
        messageRef: useRef(null),
        errorRef: useRef()
    }

    useEffect(() => {
        dispatch(setItem({key: 'title', value: "Let's Get In Touch!"}));
    }, [dispatch])

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Retrieve form input values
        const email = event.target.email.value;
        const message = event.target.message.value;

        // Check if both email and message are filled in
        if (email && message) {
            // Here you can perform actions with the form data
            try {
                const contactInfo = {
                    email,
                    message
                }
                dispatch(setObjectItem({key: 'eventProperties', innerKey: "isLoading", value: true}));
                const response = await contact(contactInfo).unwrap();
                console.log("Response is : ", response);
                if (isSuccess) await dispatch(setObjectItem({
                    key: 'eventProperties',
                    innerKey: "isLoading",
                    value: false
                }));
                if (response?.statusCode === 200) {
                    console.log("Status code is ", response.statusCode);
                    event.target.email.value = "";
                    event.target.message.value = "";
                    navigate(publicPaths.messageSentPath);
                    //reset();
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

            } catch (error) {
                dispatch(setObjectItem({key: 'eventProperties', innerKey: "isLoading", value: false}));
                await dispatch(setObjectItem({
                    key: 'eventProperties', innerKey: "errorMessage",
                    value: "Error logging in."
                }));
                await dispatch(setObjectItem({key: 'eventProperties', innerKey: "isError", value: true}));
            }

            // Example: Send form data to backend, update state, etc.
            setSubmitSuccess(true);
            setSubmitError(false);
        } else {
            // Handle case where either email or message is missing
            setSubmitSuccess(false);
            setSubmitError(true);
        }
    };

    return (
        <div className="container px-4 px-lg-5">
            <div className="row gx-4 gx-lg-5 justify-content-center">
                <div className=" text-center" style={{width: '100%'}}>
                    <WelcomeText
                        text={"Ready to start your next project with us? Send us a messages and we will get back to you as soon as possible!"}/>
                </div>
            </div>
            <div className="row gx-4 gx-lg-5 justify-content-center mb-5">
                <form id="contactForm" onSubmit={handleSubmit}>
                    {/* Email address input */}
                    <div className="form-floating mb-3">
                        <input name="email" id="email" className="form-control" type="email"
                               placeholder="name@example.com" required/>
                        <label htmlFor="email">Email address</label>
                    </div>
                    {/* Message input */}
                    <div className="form-floating mb-3">
                        <textarea name="message" id="message" className="form-control"
                                  placeholder="Enter your message here..." style={{height: '10rem'}} required/>
                        <label htmlFor="message">Message</label>
                    </div>
                    <ErrorMessageComponent ref={refs.errorRef}/>
                    {/* Submit Button */}
                    <div className="d-grid">
                        <button id="submitButton" className="btn btn-primary btn-xl" type="submit">Submit</button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default Contact;
