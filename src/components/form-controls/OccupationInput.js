import React from 'react'

import InputField from './InputField'
import { useSelector } from 'react-redux';
import { selectMoreInputsValids } from '../../features/auth/authSlice';
import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import { setObjectItem } from '../../features/auth/authSlice';

const OccupationInput = forwardRef(({}, ref) => {
    const valids = useSelector(selectMoreInputsValids)
    const dispatch = useDispatch();
    const handleChange = (event) => {
        dispatch(setObjectItem({ key: 'moreInputs', innerKey: 'occupation', value: event.target.value }));
    };

  return (
    <InputField
        label="Occupation"
        id="occupation"
        type="text"
        name="occupation"
         ref={ref}
        required
        onChange={handleChange}
        validation={{
            isValid: valids.validOccupation,
            message: <>Enter your occupation, e.g. teacher, driver, doctor, engineer, etc.
            Input a word or phrase, without special characters. <br /></>
        }}
        ariaDescribedBy="occupationnote"
        placeholder="Enter occupation here..."
    />
  )
});

export default OccupationInput