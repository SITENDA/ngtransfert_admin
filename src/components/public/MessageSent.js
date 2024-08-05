import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setItem } from '../../features/auth/authSlice';
import { publicPaths } from '../../util/frontend';
import WelcomeButton from '../WelcomeButton';

const MessageSent = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    
    useEffect(() => {
      dispatch(setItem({ key: 'title', value: "Message Sent" }));
    }, [dispatch])
    const handleClick = () => {
        navigate(publicPaths.landingPagePath)
      }
  
    return (
        <div className="col-lg-8 text-center">
        <h2 className="text-white font-weight-normal mb-3">Message Sent Successfully</h2>
        <hr className="divider divider-light" />
        <div className="text-white-75 mb-4 paragraph-background" style={{ fontSize: '1.2rem' }}>
            Thank you for reaching out to no-vic.com. Our team has received your message and will send you a reply via your email address.
        </div>
        <WelcomeButton onClick={handleClick} text="Return to homepage" />
    </div>
    );
  };

  export default MessageSent;