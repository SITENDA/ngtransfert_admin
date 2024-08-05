import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { selectEventProperties } from '../../features/auth/authSlice';

const ErrorMessageComponent = forwardRef(({ }, ref) => {
const eventProperties = useSelector(selectEventProperties);

  return (
    <div
      ref={ref}
      className={eventProperties.isError  && eventProperties.errorMessage? "alert alert-danger" : "offscreen"}
      role="alert"
      aria-live='assertive'
      tabIndex={-1}
      style={{width: '90%'}}
    >
      {eventProperties.errorMessage}
    </div>
  );
});

export default ErrorMessageComponent;
