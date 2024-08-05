import React from 'react'

import InputField from './InputField'
import { useSelector } from 'react-redux';
import { selectCurrentValids } from '../../features/auth/authSlice';
import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { setObjectItem } from '../../features/auth/authSlice';

const ConfirmPasswordInput = forwardRef(({}, ref) => {
    const valids = useSelector(selectCurrentValids)
    const dispatch = useDispatch();
    const handleChange = (event) => {
        dispatch(setObjectItem({ key: 'registrationInputs', innerKey: 'confirmPassword', value: event.target.value }));
    };

  return (
    <InputField
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            ref={ref}
            required
            onChange={handleChange}
            validation={{
                isValid: valids.validConfirmPassword,
                message: <>Must match the first password input field</>
            }}
            ariaDescribedBy="confirmpasswordnote"
            placeholder="Type password again"
        />
  )
});

export default ConfirmPasswordInput